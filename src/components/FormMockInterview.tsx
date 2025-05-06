import { Interview } from "@/types"
import CustomBreadCrumb from "./CustomBreadCrumb";


import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import Headings from "./Headings";
import { Button } from "./ui/button";
import { Loader, Trash2 } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { chatSession } from "@/scripts";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase.config";


interface FormMockInterviewProps {
    initialData: Interview | null; 
}



const formSchema = z.object({

    position: 
            z
            .string()
            .min(1, "Position is required")
            .max(100, "Position must be 100 characters or less"),

    description: 
            z
            .string()
            .min(10, "min 10 characters description is required"),
    
    experience: 
            z
            .coerce
            .number()
            .min(0, "Experience cannot be empty or negative"),

    techStack:
            z
            .string()
            .min(1, "Tech stack must be atleast a character"),


});



type FormData = z.infer<typeof formSchema>;


const FormMockInterview = ({initialData}: FormMockInterviewProps) => {

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {},
    });

    const { isValid, isSubmitting } = form.formState;
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { userId } = useAuth();


    const title = initialData?.position
                    ?
                    initialData.position
                    : 
                    "Create a new Mock Interview";



    const breadCrumbPage = initialData?.position
                            ?
                            "Edit"
                            : 
                            "Create";

    const actions = initialData?.position
                            ?
                            "Save Changes"
                            : 
                            "Create";


    const toastMessage = initialData?.position
                            ?
                            { title: "Updated...!", description: "Changes saved successfully..." }
                            : 
                            { title: "Created...!", description: "New Mock Interview Created..." };



    const cleanAiResponse = (responseText: string) => {
        let cleanText = responseText.trim();

        cleanText = cleanText.replace(/(json|```|`)/g, "");
    
        const jsonArrayMatch = cleanText.match(/\[.*\]/s);

        if(jsonArrayMatch) {
            cleanText = jsonArrayMatch[0];
        }
        else {
            throw new Error("No JSON array found in response");
        }

        try {
            return JSON.parse(cleanText);
        } catch (error) {
            throw new Error("Invalid JSON format: "+ (error as Error)?.message);
        }
    };


    const generateAiResponse = async(data: FormData) => {

        const prompt = `
        As an experienced prompt engineer, generate a JSON array containing 5 technical interview questions along with detailed answers based on the following job information and make sure you consider their experience and the job role they are applying for, the difficulty and evaluation standard should vary based on experience and the job role and also other job information. Make sure you ask questions relevant to the current job market, what kind of questions are being asked in real interviews. Each object in the array should have the fields "question" and "answer", formatted as follows:

        [
          { "question": "<Question text>", "answer": "<Answer text>" },
          ...
        ]

        Job Information:
        - Job Position: ${data?.position}
        - Job Description: ${data?.description}
        - Years of Experience Required: ${data?.experience}
        - Tech Stacks: ${data?.techStack}

        The questions should assess skills in ${data?.techStack} development and best practices, problem-solving, and experience handling complex requirements. Please format the output strictly as an array of JSON objects without any additional labels, code blocks, or explanations. Return only the JSON array with questions and answers.
        `;


        const aiResult = await chatSession.sendMessage(prompt);
        const cleanedResponse = cleanAiResponse(aiResult.response.text());

        return cleanedResponse; 

    };

    const onSubmit = async(data: FormData) => {
        try {
            
            setIsLoading(true);
            console.log(data); 


            if(initialData) {
                // update
                if(isValid) {
                    const aiResult = await generateAiResponse(data);

                    await updateDoc(doc(db, "Interviews", initialData?.id), {
                        questions: aiResult,
                        ...data,
                        updatedAt: serverTimestamp(),
                    })

                    toast(toastMessage.title, {description: toastMessage.description});

                }
            }
            else {
                // create new mock interview

                if(isValid) {
                    const aiResult = await generateAiResponse(data);

                    await addDoc(collection(db, "Interviews"), {
                        ...data,
                        userId,
                        questions: aiResult,
                        createdAt: serverTimestamp()
                    });

                    toast(toastMessage.title, {description: toastMessage.description});

                }

            }

            navigate("/generate", {replace: true});

        } catch (error) {
            console.log(error)
            toast.error("Error...", {
                description: "Something went wrong, Please try again later",
            });
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {

        if(initialData) {
            form.reset({
                position: initialData.position,
                description: initialData.description,
                experience: initialData.experience,
                techStack: initialData.techStack,
            });
        }

    }, [initialData, form]);


  return (
    <div>

        <CustomBreadCrumb
            breadCrumbPage={breadCrumbPage}
            breadCrumbItems={[{ label: "Mock Interviews", link: "/generate"}]}
        />

        <div className="mt-4 flex items-center justify-between w-full">
            <Headings title={title} isSubHeading />

            {initialData && (
                <Button onClick={() => form.reset()} size={"icon"} variant={"ghost"}>
                    <Trash2 className="min-w-4 min-h-4 text-red-500" />
                </Button>
            )}
        </div>

        <Separator className="my-4" />

        <div className="my-6"></div>

        <FormProvider {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full p-8 rounded-lg flex flex-col items-start justify-start gap-6 shadow-md"
            >   

                <FormField
                    control={form.control}
                    name="position"
                    render={({field}) => (
                        <FormItem className="w-full space-y-4">
                            <div className="w-full flex items-center justify-between">
                                <FormLabel>
                                    Job Role / Job Position 
                                </FormLabel>

                                <FormMessage className="text-sm" />
                            </div>

                            <FormControl>
                                <Input 
                                    disabled={isLoading} 
                                    className="h-12" 
                                    placeholder="Eg:- Full Stack Developer" 
                                    {...field}
                                    value={field.value || ""}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />


                {/* description */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({field}) => (
                        <FormItem className="w-full space-y-4">
                            <div className="w-full flex items-center justify-between">
                                <FormLabel>
                                    Job Description 
                                </FormLabel>

                                <FormMessage className="text-sm" />
                            </div>

                            <FormControl>
                                <Textarea 
                                    {...field}
                                    disabled={isLoading}
                                    className="h-12"
                                    placeholder="Eg:- Describe your job role or position"
                                    value={field.value || ""}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />



                {/* experience */}
                <FormField
                    control={form.control}
                    name="experience"
                    render={({field}) => (
                        <FormItem className="w-full space-y-4">
                            <div className="w-full flex items-center justify-between">
                                <FormLabel>
                                    Years of Experience
                                </FormLabel>

                                <FormMessage className="text-sm" />
                            </div>

                            <FormControl>
                                <Input 
                                    disabled={isLoading} 
                                    type="number"
                                    className="h-12" 
                                    placeholder="Eg:- 5"
                                    {...field} 
                                    value={field.value || ""}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="techStack"
                    render={({field}) => (
                        <FormItem className="w-full space-y-4">
                            <div className="w-full flex items-center justify-between">
                                <FormLabel>
                                    Tech Stack 
                                </FormLabel>

                                <FormMessage className="text-sm" />
                            </div>

                            <FormControl>
                                <Textarea 
                                    disabled={isLoading} 
                                    className="h-12" 
                                    placeholder="Eg:- React, Javascript... (give comma-sepated inputs)" 
                                    {...field}
                                    value={field.value || ""}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />  

                <div className="w-full flex items-center justify-end gap-6">
                    <Button 
                        type="reset" 
                        size={"sm"} 
                        variant={"outline"} 
                        disabled={isSubmitting || isLoading}
                        onClick={() => form.reset()}
                    >
                        Reset
                    </Button>


                    <Button 
                        type="submit" 
                        size={"sm"}  
                        disabled={isSubmitting || isLoading || !isValid}
                    >
                        {isLoading 
                            ? 
                            (<Loader className="text-gray-50 animate-spin" />) 
                            : 
                            (actions)
                        }
                    </Button>
                </div>

            </form>
        </FormProvider>

    </div>
  )
}

export default FormMockInterview