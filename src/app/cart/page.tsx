"use client";
import { IProduct, Product } from "@entities/product";
import { Button } from "@shared/ui/button";

import { ChevronLeft, Minus, Plus, Trash2 } from "lucide-react";
import React from "react";
import Image from "next/image";
import { useCart } from "@entities/cart/model/store";
import { useProductsController } from "@entities/product/api";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const CartItem = ({ product }: { product: IProduct }) => {
  const { addProduct, removeProduct, getProductCount } = useCart();
  const count = getProductCount(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-row justify-between items-center w-full"
    >
      <div className="flex flex-row gap-4 items-center ">
        <Image
          src={product.image}
          alt={product.name}
          width={100}
          height={100}
          className="rounded-[40px] w-[200px] aspect-square object-cover shadow-lg"
        />
        <div className="flex flex-col gap-4">
          <div className="text-stone-500 text-5xl font-medium">
            {product.name}
          </div>
          <div className="text-yellow-950 text-5xl font-bold">
            {product.price} ₽
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 items-center">
        <div className="flex flex-row gap-4 items-center">
          <Button
            variant="outline"
            className=" rounded-full bg-none size-12 !text-foreground border-foreground border-4 opacity-80"
            onClick={() => removeProduct(product)}
            disabled={count <= 0}
          >
            <Minus className="size-6" />
          </Button>
          <motion.p
            key={count}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            className="text-5xl font-bold leading-none"
          >
            {count}
          </motion.p>
          <Button
            variant="outline"
            className=" rounded-full  bg-none size-12 !text-foreground  border-foreground border-4 opacity-80"
            onClick={() => addProduct(product)}
          >
            <Plus className="size-6" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const CartPage = () => {
  const { cart, clearCart, getTotalPrice, getTotalItems, addProduct } =
    useCart();
  const { products, isProductsLoading } = useProductsController();
  const router = useRouter();
  // Получаем уникальные товары для отображения
  const uniqueProducts =
    cart?.products?.reduce((acc: IProduct[], product: IProduct) => {
      const existing = acc.find((p: IProduct) => p.id === product.id);
      if (!existing) {
        acc.push(product);
      }
      return acc;
    }, [] as IProduct[]) ?? [];

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const isEmpty = totalItems === 0;

  return (
    <main className="flex flex-col h-full min-h-screen p-10 gap-10 items-center">
      <div className="flex flex-row justify-between items-center w-full flex-shrink-0">
        <div className="flex flex-row justify-start items-center w-fit">
          <ChevronLeft
            className="size-15 text-muted-foreground"
            onClick={() => router.back()}
          />
          <h1 className="text-6xl font-black">Корзина</h1>
        </div>

        {!isEmpty && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            role="button"
            onClick={clearCart}
            className="text-4xl font-black opacity-50 cursor-pointer flex flex-row items-center gap-4 hover:opacity-70 transition-opacity"
          >
            Очистить корзину <Trash2 className="size-12" />
          </motion.div>
        )}
      </div>

      <div className="flex-1 w-full min-h-0 bg-white rounded-[60px] shadow-2xl flex flex-col gap-5 overflow-y-auto p-10">
        <AnimatePresence mode="wait">
          {isEmpty ? (
            <motion.div
              key="empty-cart"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex items-center justify-center"
            >
              <div className="text-center text-gray-500 text-4xl">
                Корзина пуста
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="cart-items"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-5"
            >
              {uniqueProducts.map((product: IProduct) => (
                <CartItem key={product.id} product={product} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {!isProductsLoading && products && products.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.6, ease: "easeInOut" },
              opacity: { duration: 0.4, delay: 0.2 },
            }}
            className="w-full bg-white rounded-[60px] shadow-2xl overflow-hidden"
          >
            <div className="p-10 flex flex-col gap-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="text-center justify-center text-yellow-950 text-5xl font-bold"
              >
                Подобрали для тебя
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-row gap-4"
              >
                {products?.slice(0, 4).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    className="flex flex-col gap-4"
                  >
                    <Product product={product as IProduct} isLoading={false} />
                    <Button
                      className="rounded-full text-4xl h-[60px]"
                      onClick={() => addProduct(product as IProduct)}
                    >
                      Добавить
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isEmpty && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col gap-4"
          >
            <div className="flex justify-between items-center text-4xl font-bold text-yellow-950">
              <span>Итого ({totalItems} товаров):</span>
              <span>{totalPrice.toFixed(2)} ₽</span>
            </div>
            <Button size="lg" onClick={() => router.push("/order")}>
              Заказать
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default CartPage;
