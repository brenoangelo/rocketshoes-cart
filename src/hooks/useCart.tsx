import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }
    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      // TODO
      const updatedCart = Array.from(cart)

      const productExists = updatedCart.find(product => product.id === productId)

      const stock = await api.get<Stock>(`stock/${productId}`)
        .then(response => response.data)

      const stockAmount = stock.amount

      const currentAmount = productExists ? productExists.amount : 0
      const amount = currentAmount + 1
      
      if(amount > stockAmount) {
        throw toast.error('Quantidade fora de estoque');
      }
      
      const product = await api.get<Product>(`products/${productId}`)
      .then(response => response.data)

      if(productExists) {
        const index = updatedCart.findIndex(product => product.id === productExists.id)
        updatedCart.splice(index, 1, {...productExists, amount: amount})

        setCart(updatedCart)
        toast.success('Produto adicionado com sucesso!')
        return localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart));
      }
      const updatedCartData = [...cart, {...product, amount: amount}]
      
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCartData));
      setCart(updatedCartData)

      toast.success('Produto adicionado com sucesso!')
    } catch {
      // TODO
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
      const updatedCart = Array.from(cart)
      
      const productIndex = updatedCart.findIndex(product => product.id === productId)

      updatedCart.splice(productIndex, 1)
      
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart));
      setCart(updatedCart)

    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
