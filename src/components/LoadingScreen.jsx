export default function LoadingScreen() {
  return (
<div className="fixed inset-0 flex items-center justify-center">
  <div className="opacity-30 z-50 bg-linear-to-br from-blue-500 to-purple-700"></div>
      <div className="w-16 h-16 rounded-full animate-spin ease-in-out 
     bg-[conic-gradient(from_0deg,var(--color-blue-500),var(--color-purple-500),transparent)]
     mask-[radial-gradient(farthest-side,transparent_70%,black_71%)]">
        
     </div>
     {/* <div className="text-2xl font-bold">Loading...</div> */}
     

</div>
  );
}