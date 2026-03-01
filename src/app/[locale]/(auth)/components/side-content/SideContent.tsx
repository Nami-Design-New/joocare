const SideContent = () => {
  return (
    <div className="h-[50dvh] md:h-[calc(100vh-75px)] bg-[linear-gradient(45deg,#0A3463,#6CABEC)] flex items-center  gap-4">
      <div className="w-5/6 mx-auto p-4 text-white">
        <h2 className="text-[clamp(1.5rem,4vw,3rem)] font-bold">
          Match Faster
        </h2>
        <h3 className="text-[clamp(1.5rem,4vw,3rem)] font-bold mb-4">
          work smarter
        </h3>

        <p className="text-[clamp(.8rem,4vw,1.2rem)] [word-spacing:0.1rem] text-justify">
          With smart tools and AI-powered insights, joocare helps you find the
          right opportunity and land the job you deserve with confidence.
        </p>
      </div>
    </div>
  );
};

export default SideContent;
