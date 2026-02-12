export const Logo = ({ className = "w-10 h-10" }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 1080 1080" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      fill="currentColor"
    >
      <path d="M671.56,0H116.43c255.82,127.91,341.65,451.09,182.99,689.08l-76.05,114.08C173.58,877.84,89.76,922.7,0,922.7h0v157.3h157.3c0-89.76,44.86-173.58,119.55-223.37l114.08-76.05c237.98-158.66,561.17-72.83,689.08,182.99V408.44C1080,182.86,897.14,0,671.56,0Z"/>
    </svg>
  );
};
