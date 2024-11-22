function Card({ heading, children }) {
  return (
    <div className="flex flex-col w-full">
      <div className="my-2 md:my-4 md:flex-row rounded-xl shadow-lg p-2 border border-white bg-white">
        <p className="text-center text-lg font-semibold py-2 md:py-4">
          {heading}
        </p>
        {children}
      </div>
    </div>
  );
}

export default Card;
