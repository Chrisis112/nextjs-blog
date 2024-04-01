import {CartContext} from "@/components/AppContext";
import MenuItemTile from "@/components/menu/MenuItemTile";
import Image from "next/legacy/image";
import {useContext, useState} from "react";
import {useProfile} from "@/components/UseProfile";

export default function MenuItem(menuItem) {
  const {
    image,name,description,basePrice,
    sizes, extraIngredientPrices, temperature, pricePoints
  } = menuItem;
  const [
    selectedSize, setSelectedSize
  ] = useState(sizes?.[0] || null);
  const [
    selectedTemperature, setSelectedTemperature
  ] = useState(temperature?.[0] || null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const {addToCart} = useContext(CartContext);
  const [address, setAddress] = useState({});
  const {data:profileData} = useProfile();

  async function handleAddToCartButtonClick() {
    console.log('add to cart');
    const hasOptions = sizes.length > 0 || temperature.length > 0 || extraIngredientPrices.length > 0;
    if (hasOptions && !showPopup) {
      setShowPopup(true);
      return;
    }
    addToCart(menuItem, selectedSize, selectedExtras, selectedTemperature);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('hiding popup');
    setShowPopup(false);
  }
  function handleExtraThingClick(ev, extraThing) {
    const checked = ev.target.checked;
    if (checked) {
      setSelectedExtras(prev => [...prev, extraThing]);
    } else {
      setSelectedExtras(prev => {
        return prev.filter(e => e.name !== extraThing.name);
      });
    }
  }

  let selectedPrice = basePrice;
  let selectedPoints = pricePoints;
  if (selectedSize) {
    selectedPrice += selectedSize.price;
    selectedPoints += selectedSize.price;
  }
  if (selectedExtras?.length > 0) {
    for (const extra of selectedExtras) {
      selectedPrice += extra.price;
      selectedPoints += extra.price;
    }
  }if (selectedTemperature?.length > 0) {
    for (const temp of selectedTemperature) {
      selectedPrice += temp.price;
      selectedPoints += temp.price;
    }
  }
  

  return (
    <>
      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div style= {{
                width: "200px"
              }}
            onClick={ev => ev.stopPropagation()}
            className="my-8 bg-white p-2 rounded-lg max-w-md">
            <div
              className="overflow-y-scroll p-2 items-center"
              style={{maxHeight:'calc(100vh - 100px)'}}>
              <Image 
                src={image}
                alt={name}
                width={220} height={300}
                className="flex items-center text-center  p-2" />
              <h2 className="text-lg font-bold text-center mb-2">{name}</h2>
              <p className="text-center text-gray-500 text-sm mb-2">
                {description}
              </p>
              {sizes?.length > 0 && (
                <div className="py-2">
                  <h3 className="text-center text-gray-700">Pick your size</h3>
                  {sizes.map(size => (
                    <label
                      key={size._id}
                      className="flex items-center gap-2 p-4 border rounded-md mb-1">
                      <input
                        type="radio"
                        onChange={() => setSelectedSize(size)}
                        checked={selectedSize?.name === size.name}
                        name="size"/>
                      {size.name} €{basePrice + size.price}
                      
                    </label>
                  ))}
                </div>
              )}
              {temperature?.length > 0 && (
                <div className="py-2">
                  <h3 className="text-center text-gray-700">Sellect temperature</h3>
                  {temperature.map(temperature => (
                    <label
                      key={temperature._id}
                      className="flex items-center gap-2 p-4 border rounded-md mb-1">
                      <input
                        type="radio"
                        onChange={() => setSelectedTemperature(temperature)}
                        checked={selectedTemperature.name === temperature.name}
                        name="temperature" />
                      {temperature.name} {temperature.price} 
                    </label>
                  ))}
                </div>
              )}
              {extraIngredientPrices?.length > 0 && (
                <div className="py-2">
                  <h3 className="text-center text-gray-700">Any extras?</h3>
                  {extraIngredientPrices.map(extraThing => (
                    <label
                      key={extraThing._id}
                      className="flex items-center gap-2 p-4 border rounded-md mb-1">
                      <input
                        type="checkbox"
                        onChange={ev => handleExtraThingClick(ev, extraThing)}
                        checked={selectedExtras.map(e => e._id).includes(extraThing._id)}
                        name={extraThing.name} />
                      {extraThing.name} +€{extraThing.price}
                    </label>
                  ))}
                </div>
              )}
              <button
                targetTop={'5%'}
                targetLeft={'95%'}
                src={image}>
                <div className="primary sticky bottom-2"
                     onClick={handleAddToCartButtonClick}>
                  Add to cart €{selectedPrice}
                 
                </div>
                
              </button>

              <button
                className="mt-2"
                onClick={() => setShowPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <MenuItemTile
        onAddToCart={handleAddToCartButtonClick}
        {...menuItem} />
    </>
  );
}