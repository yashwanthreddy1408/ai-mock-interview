import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { Interview } from "@/types";

import LoaderPage from "./LoaderPage";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";
import { QuestionSection } from "@/components/QuestionSection";

type RouteParams = {
  interviewId: string;
};

// Optional: define this type to help casting the Firestore result
type InterviewFromDB = Omit<Interview, "id">;

export const MockInterviewPage = () => {
  const { interviewId } = useParams<RouteParams>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterview = async () => {
      if (!interviewId) {
        navigate("/generate", { replace: true });
        return;
      }

      try {
        const ref = doc(db, "Interviews", interviewId);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) {
          console.warn("Interview not found.");
          navigate("/generate", { replace: true });
          return;
        }

        const data = snapshot.data() as InterviewFromDB;
        if (!data) {
          console.warn("Interview data is empty.");
          navigate("/generate", { replace: true });
          return;
        }

        const interviewData: Interview = {
          id: snapshot.id,
          ...data,
        };

        setInterview(interviewData);
      } catch (err) {
        console.error("Failed to load interview:", err);
        navigate("/generate", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId, navigate]);

  if (isLoading) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  return (
    <div className="flex flex-col w-full gap-8 py-5">
      <CustomBreadCrumb
        breadCrumbPage="Start"
        breadCrumbItems={[
          { label: "Mock Interviews", link: "/generate" },
          {
            label: interview?.position || "Interview",
            link: `/generate/interview/${interview?.id}`,
          },
        ]}
      />

      <div className="w-full">
        <Alert className="bg-sky-100 border border-sky-200 p-4 rounded-lg flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-sky-600" />
          <div>
            <AlertTitle className="text-sky-800 font-semibold">
              Important Note
            </AlertTitle>
            <AlertDescription className="text-sm text-sky-700 mt-1 leading-relaxed">
              Press "Record Answer" to begin answering the question. Once you
              finish the interview, you&apos;ll receive feedback comparing your
              responses with the ideal answers.
              <br />
              <br />
              <strong>Note:</strong>{" "}
              <span className="font-medium">Your video is never recorded.</span>{" "}
              You can disable the webcam anytime if preferred.
            </AlertDescription>
          </div>
        </Alert>
      </div>

      {interview?.questions?.length && interview.questions.length > 0 && (
        <div className="mt-4 w-full flex flex-col items-start gap-4">
          <QuestionSection questions={interview.questions} />
        </div>
      )}
    </div>
  );
};
