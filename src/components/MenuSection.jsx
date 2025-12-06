import React from 'react';
import { useTheme } from '../context/ThemeContext';
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router-dom';
import '../i18n';
import { useTranslation } from 'react-i18next';

const Menu = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Espresso", price: "$3", image: "data:image/jpeg;base64,..."},
    { name: "Cappuccino", price: "$4", image: "data:image/jpeg;base64,..."}
  ];

  return (
    <div className={`menu-container ${theme}`}>
      {menuItems.map((item, index) => (
        <ProductCard
          key={index}
          name={t(item.name)}
          price={item.price}
          image={item.image}
          onClick={() => navigate(`/product/${index}`)}
        />
      ))}
    </div>
  );
};

export default Menu;
