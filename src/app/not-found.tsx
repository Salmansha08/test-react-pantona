import { BackHomeButton } from "@/components/back-home-button";

const NotFound = () => {
  return (
    <>
      <main className="grid place-items-center min-h-svh">
        <div className="text-center">
          <span className="text-9xl font-bold">404</span>
          <h1 className="text-3xl">Page not found</h1>
          <p className="mt-2">The page you're looking for is not exist</p>
          <div className="flex items-center gap-2 w-full mt-10">
            <BackHomeButton />
          </div>
        </div>
      </main>
    </>
  );
};

export default NotFound;
