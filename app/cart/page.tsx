"use client";
import React, { useEffect, useMemo, useState } from "react";

import Image from "next/image";

import Modal from "@/components/modal";
import CartDeleteModal from "@/components/cartDeleteModal";
import { useRouter } from "next/navigation";

import { useUserIdStore } from "@/app/store";
import { commonFetch } from "@/utils/commonFetch";

import CartProductItem from "@/components/cartProductItem";
import CartOptionChangeModal from "@/components/cartOptionChangeModal";
import HorizontalLine from "@/components/horizontalLine";

import emptyCart from "../../public/emptyCart.png";

interface Products {
  quantity: number;
  product: ProductItem;
  size_attribute: {
    id: number;
    size: {
      name: string;
    };
  };
  index: string;
}

interface ProductItem {
  OriginPrice: number;
  category: number;
  discountPrice: number;
  discountRate: number;
  id: number;
  image_url: string;
  productName: string;
  user: {
    id: number;
    username: string;
  };
}

export default function Page() {
  const { userId } = useUserIdStore();

  const [totalCount, setTotalCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOptionChangeModalOpen, setIsOptionChangeModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(0);
  const [selectedProductOptionId, setSelectedProductOptionId] = useState(0);

  const [changeProductId, setChangeProductId] = useState(0);
  const [changeOptionId, setChangeOptionId] = useState(0);
  const [changeQuantity, setChangeQuantity] = useState(0);

  const [refreshFlag, setRefreshFlag] = useState(false);

  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const res = await commonFetch(
            `${process.env.NEXT_PUBLIC_API_URL}/cart/${userId}`,
            "get"
          );
          if (res.Message === "SUCCESS") {
            setTotalCount(res.totalCount);
            const copyArray = structuredClone(res?.data);
            const addCheckedArray = copyArray?.map((item: Products) => ({
              ...item,
              index: `${item?.product?.id}` + `${item?.size_attribute?.id}`,
            }));
            setCheckedItems(
              addCheckedArray?.map((item: Products) => item?.index)
            );
            setCartItems(addCheckedArray);
          }
        } catch (error) {
          if (error instanceof Error) {
            alert(error.message);
          }
        }
      }
    };
    fetchData();
  }, [userId, refreshFlag]);

  function handleClickDelete(productId: number, optionId: number) {
    setIsModalOpen(true);
    setSelectedProductId(productId);
    setSelectedProductOptionId(optionId);
  }

  function handleCheckboxChange(index: string) {
    setCheckedItems((checkedItems) => {
      if (checkedItems.includes(index)) {
        return checkedItems.filter((item) => item !== index);
      } else {
        return [...checkedItems, index];
      }
    });
  }

  function handleClickAllCheck() {
    if (checkedItems.length === totalCount) {
      setCheckedItems([]);
    } else {
      setCheckedItems(
        cartItems?.map(
          (item: Products) =>
            `${item?.product?.id}` + `${item?.size_attribute?.id}`
        )
      );
    }
  }

  function handleClickSubmit() {
    const selectedProducts: Products[] = [];
    if (checkedItems.length === 0) {
      alert("옵션를 선택하십시오.");
      return;
    }
    checkedItems?.map((index) => {
      const product = cartItems.find((item: Products) => item?.index === index);
      if (product) {
        selectedProducts?.push(product);
      }
    });
    sessionStorage.setItem(
      "selectedProducts",
      JSON.stringify(selectedProducts)
    );
    router.push("/checkout");
  }

  function calculateTotalPrice(checkedItems: string[], cartItems: Products[]) {
    let totalOriginPrice = 0;
    let totalDiscountPrice = 0;
    checkedItems.map((index) => {
      const product = cartItems.find((item) => item?.index === index);
      if (product) {
        totalOriginPrice += product?.product?.OriginPrice * product?.quantity;
        totalDiscountPrice +=
          product?.product?.discountPrice * product?.quantity;
      }
    });
    return { totalOriginPrice, totalDiscountPrice };
  }

  const { totalOriginPrice, totalDiscountPrice } = useMemo(() => {
    return calculateTotalPrice(checkedItems, cartItems);
  }, [cartItems, checkedItems]);

  return (
    <div className="w-full min-h-full pb-[68px]">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CartDeleteModal
          onClose={() => setIsModalOpen(false)}
          productId={selectedProductId}
          optionId={selectedProductOptionId}
          userId={userId}
          setRefreshFlag={setRefreshFlag}
          refreshFlag={refreshFlag}
        />
      </Modal>
      <Modal
        isOpen={isOptionChangeModalOpen}
        onClose={() => setIsOptionChangeModalOpen(false)}
      >
        <CartOptionChangeModal
          onClose={() => setIsOptionChangeModalOpen(false)}
          previousProductId={changeProductId}
          previousOptionId={changeOptionId}
          previousQuantiry={changeQuantity}
          setRefreshFlag={setRefreshFlag}
          refreshFlag={refreshFlag}
        />
      </Modal>
      <HorizontalLine />
      <div className=" w-full h-[50px]  bg-white text-center leading-[50px] flex px-[15px] justify-center">
        <div className="pt-1">
          <input
            type="checkbox"
            className={`w-5 h-5 checked:bg-primary border  border-[#ccc] checked:border-primary bg-[#fff] rounded-full mr-2.5 appearance-none checked:bg-checkedWhite 	`}
            onChange={handleClickAllCheck}
            checked={checkedItems.length === totalCount}
            style={{
              backgroundImage: "url('/check_white.png')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "contain",
            }}
          />
        </div>
        <span className="text-center">
          총 장바구니 갯수 <span className="text-primary"> {totalCount}</span>{" "}
          개
        </span>
      </div>
      <HorizontalLine />
      <div className="w-full">
        <div className="w-full h-full px-[15px] pt-6 pb-5">
          {cartItems?.length === 0 ? (
            <div className="flex flex-col items-center text-center gap-5">
              <Image
                src={emptyCart}
                alt="Flaticon_image"
                width={150}
                height={150}
              />
              <span>장바구니에 담긴 상품이 없습니다. </span>
            </div>
          ) : (
            <>
              {cartItems.map((item: Products) => (
                <div key={`${item?.product?.id + item?.size_attribute?.id}`}>
                  <CartProductItem
                    item={item}
                    handleClickDelete={handleClickDelete}
                    checkedItems={checkedItems}
                    handleCheckboxChange={handleCheckboxChange}
                    setIsOptionChangeModalOpen={setIsOptionChangeModalOpen}
                    setChangeProductId={setChangeProductId}
                    setChangeOptionId={setChangeOptionId}
                    setChangeQuantity={setChangeQuantity}
                  />
                </div>
              ))}
            </>
          )}
        </div>
        <HorizontalLine />{" "}
        <div className="py-[30px] w-full px-4">
          <h1 className="text-lg font-bold mb-5">
            결제할 상품
            <span className="text-[#666]"> 총 {checkedItems?.length}개</span>
          </h1>
          <div className="flex justify-between">
            <span className="text-sm">상품 금액</span>
            <span className="text-sm">
              {totalOriginPrice?.toLocaleString()}원
            </span>
          </div>
          <div className="flex justify-between my-3">
            <span className="text-sm">할인 된 금액</span>
            <div className="flex">
              <span className="text-red-500 mr-[10px] text-sm	">
                {Math.round(
                  ((totalOriginPrice - totalDiscountPrice) / totalOriginPrice) *
                    100
                ) || 0}
                % SALE
              </span>
              <span className="text-blue-500 text-sm">
                -
                {(totalOriginPrice - totalDiscountPrice || 0)?.toLocaleString()}
                원
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">결제 금액</span>
            <span className="font-bold text-lg">
              {totalDiscountPrice?.toLocaleString()}원
            </span>
          </div>
        </div>
        <div className="fixed bottom-0 w-full border z-10 bg-white px-3 py-2">
          <button
            className="w-full h-[50px] bg-primary text-center leading-[50px] rounded flex justify-center"
            onClick={handleClickSubmit}
          >
            <span className="text-white mr-5">
              총 {checkedItems?.length} 개
            </span>
            <span className="font-bold text-white">
              {totalDiscountPrice?.toLocaleString()}원 결제하기
            </span>
          </button>
        </div>
        <HorizontalLine />
      </div>
    </div>
  );
}
