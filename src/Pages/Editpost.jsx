import React , {useEffect , useState} from 'react'
import { Container , PostForm } from '../Components'
import service from '../appwrite/config'
import { useParams , useNavigate } from 'react-router-dom';


function Editpost() {
    const [post , setpost] = useState([])  ; 
    const {slug} = useParams()
    const navigate = useNavigate() ; 


    useEffect(()=>{
        if(slug){
            service.getPost(slug).then((post)=>{
                if(post){
                    setpost(post)
                }
            })
        }else{
            navigate('/')
        }
    } , [slug , navigate])
  return post ? (
    <div className='py-8'>
      <Container>
        <PostForm post={post} />
      </Container>
    </div>
  ) :null
}

export default Editpost
