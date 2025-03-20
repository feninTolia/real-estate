import React from 'react';

type Props = { title: string; subtitle: string };

const Header = ({ title, subtitle }: Props) => {
  return (
    <div className="mb-5">
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
};

export default Header;
