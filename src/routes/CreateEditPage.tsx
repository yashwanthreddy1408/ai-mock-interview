import FormMockInterview from '@/components/FormMockInterview';
import { db } from '@/config/firebase.config';
import { Interview } from '@/types';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const CreateEditPage = () => {

  const { interviewId } = useParams<{interviewId: string}>();
  const [interview, setInterview] = useState<Interview | null>(null);

  useEffect(() => {
    const fetchInterview = async() => {
    
      if(interviewId) {
      
        try {
          
          const interviewDoc = await getDoc(doc(db, "Interviews", interviewId))
          if(interviewDoc.exists()) {
            setInterview({
              id: interviewDoc.id,
               ...interviewDoc.data() 
              } as Interview);
          }
        
        } catch (error) {
          console.log(error)
        }
      
      }
    
    };

    fetchInterview();

  }, [interviewId])

  return (
    <div>
      <FormMockInterview initialData={interview} />
    </div>
  )
}

export default CreateEditPage