import React , {useCallback} from 'react'
import { useForm } from 'react-hook-form'
import {Buttons , Input , Select , RTE} from '../index'
import service from '../../appwrite/config'
import { useNavigate  } from 'react-router-dom'
import { useSelector } from 'react-redux'


function PostForm({post}) {
    // watch is used to monitor a certain feild continuously
    // control is used to provide control of a form feild
    const {register , handleSubmit , watch , setValue , control, getValues} = useForm({
        defaultValues:{
            title: post ?.title || ' ' , 
            slug : post?.slug || ' ' ,
            content : post?.content || ' ',
            status:post?.status || 'active'
        },
    })

    const navigate = useNavigate() 
    const userdata = useSelector(state=>state.user.userdata)
    const submit = async (data) => {
        if(post){
           const file =  data.image[0] ? service.uploadFile(data.image[0]) :null
           if(file){
            service.deleteFile(post.image)
           }
           const dbpost = await service.updatepost(post.$id , {
            ...data ,
            image:file?file.$id :undefined })

            if(dbpost){
             navigate(`/post/${dbpost.$id}`)
            }
           }
           else{
              const file = await service.uploadFile(data.image[0]);

              if(file){
                const fileid  = file.$id
                data.image=fileid ; 
               const dbpost =  await service.createpost({ ...data, userId: userdata.$id })
              
              if(dbpost){
                navigate(`/post/${dbpost.$id}`)
              }
           }
        }

          
       
    }


    // SLUG TRANSFORM 
    const slugTransform = useCallback((value)=>{
        if(value && typeof value === 'string'){
            return value.trim().toLowerCase().replace(/[^a-zA-Z\d\s]+/g, "-")
            .replace(/\s/g, "-");
        }
        return ''

    } , [])


    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
    <div className="w-2/3 px-2">
        <Input
            label="Title :"
            placeholder="Title"
            className="mb-4"
            {...register("title", { required: true })}
        />
        <Input
            label="Slug :"
            placeholder="Slug"
            className="mb-4"
            {...register("slug", { required: true })}
            onInput={(e) => {
                setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
            }}
        />
        <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
    </div>
    <div className="w-1/3 px-2">
        <Input
            label="Featured Image :"
            type="file"
            className="mb-4"
            accept="image/png, image/jpg, image/jpeg, image/gif"
            {...register("image", { required: !post })}
        />
        {post && (
            <div className="w-full mb-4">
                <img
                    src={service.previewFile(post.image)}
                    alt={post.title}
                    className="rounded-lg"
                />
            </div>
        )}
        <Select
            options={["active", "inactive"]}
            label="Status"
            className="mb-4"
            {...register("status", { required: true })}
        />
        <Buttons type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
            {post ? "Update" : "Submit"}
        </Buttons>
    </div>
</form>
  )
}

export default PostForm
