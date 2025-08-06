export const Header = () => {
  return (
    <header className="top-0 w-full h-16 flex flex-row justify-between bg-white shadow-sm border-b border-gray-200">
      <img src="https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png" alt="Vercel Logo" style={{height: 32}} />
      <button style={{marginLeft: 'auto'}}>Action</button>
    </header>
  );
};
