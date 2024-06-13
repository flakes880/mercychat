import CircularLoader from "./circular";

export default function OverlayLoader({ children }) {
  return (
    <div className="absolute top-0 left-0 bg-gray-100/90 w-full h-full flex justify-center items-center rounded-lg">
      <div className="flex flex-col justify-center items-center">
        <CircularLoader />
        {children}
      </div>
    </div>
  );
}
