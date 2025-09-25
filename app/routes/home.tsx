import type { Route } from "./+types/home";
import Navbar from "~/componenets/Navbar";
import ResumeCard from "~/componenets/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Link } from "react-router";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job" },
  ];
}



export default function Home() {
    
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes , setResumes] = useState<Resume[]>([]);
  const [loadingResume, setLoadingResume] = useState(false);



  useEffect(() => {
  if(!auth.isAuthenticated) navigate('/auth?next=/');
}, [auth.isAuthenticated])


  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResume(true);
      
      const resumes = (await kv.list('resume:*', true)) as KVItem[];

      const parsedResumes = resumes?.map((resume) => (
        JSON.parse(resume.value) as Resume
      ))

      setResumes(parsedResumes || []);
      setLoadingResume(false);
    }

    loadResumes()
  })


  return <main className="bg-[url('/images/bg-main.svg')] bg-cover ">
    <Navbar />
    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Track your Applications and Resume Ratings</h1>

        {!loadingResume && resumes?.length === 0 ? (
          <h2>No Resumes Found.</h2>
        ) : (
          <h2>Review your Submissions and check AI Powered Feedback.</h2>
        )}
      </div>

      {loadingResume && (
        <div className="flex flex-col items-center justify-center">
          <img src="/images/resume-scan-2.gif" className="w-[200px]" />
        </div>
      )}

    {!loadingResume && resumes.length > 0 && (
      <div className="resumes-section">
        {resumes.map((resume) => (
          <div>
        <ResumeCard key = {resume.id} resume = {resume}/>
      </div>
    ))}

    </div>
    )}

    {!loadingResume && resumes.length === 0 && (
      <div className="flex flex-col items-center justify-center mt-10 gap-4">
        <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
          Upload Resume
        </Link>
      </div>
    )}
    </section>
    </main>
}
