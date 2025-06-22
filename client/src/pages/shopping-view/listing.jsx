import { lazy, Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { useToast } from "@/hooks/use-toast";
import {
  AddCart,
  FetchCart
} from "@/store/shop/cart-slice";
import {
  FetchFilteredProducts,
  FetchProductDetails
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import bg from "../../assets/bac.jpg";

const ProductFilter = lazy(() => import("@/components/shopping-view/filter"));
const ProductDialog = lazy(() => import("@/components/shopping-view/product-details"));
const ShoppingProductTile = lazy(() => import("@/components/shopping-view/product-tile"));

function createSearchParamsHelper(filterParams) {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(state => state.shopProduct);
  const { cartList } = useSelector(state => state.shopCart);
  const { user } = useSelector(state => state.auth);
  const { toast } = useToast();
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const categorySearchParam = searchParams.get("category");

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption);
      if (indexOfCurrentOption === -1) {
        cpyFilters[getSectionId].push(getCurrentOption);
      } else {
        cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
      }
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function handleGetProductDetails(currentId) {
    dispatch(FetchProductDetails(currentId));
  }

  function handleAddToCart(productId, totalStock) {
    let getCartItems = cartList.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(item => item.productId === productId);
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > totalStock) {
          toast({
            title: `Only ${getQuantity} can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    dispatch(AddCart({ userId: user?.id, productId, quantity: 1 })).then(data => {
      if (data?.payload?.success) {
        dispatch(FetchCart(user?.id));
      }
    });

    toast({
      title: "Product Added to Cart",
    });
  }

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")));
  }, [categorySearchParam]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);

  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(FetchFilteredProducts({ filterParams: filters, sortParams: sort }));
  }, [dispatch, sort, filters]);

  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailDialog(true);
    }
  }, [productDetails]);

  return (
    <div
      className="md:max-h-[100vh] bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="backdrop-blur-sm bg-transparent min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-0 md:gap-6 p-4 md:p-6 mt-20">
          <Suspense fallback={<div>Loading Filters...</div>}>
            <ProductFilter filters={filters} handleFilter={handleFilter} />
          </Suspense>

          <div className="bg-transparent w-full rounded-lg shadow-sm">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-extrabold">All Products</h2>
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <ArrowUpDownIcon className="h-4 w-4" />
                      <span>Sort by</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                      {sortOptions.map(options => (
                        <DropdownMenuRadioItem value={options.id} key={options.id}>
                          {options.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 md:max-h-[75vh] overflow-y-auto hide-scrollbar">
              <Suspense fallback={<div>Loading Products...</div>}>
                {productList && productList.length > 0 ? (
                  productList.map(productItem => (
                    <ShoppingProductTile
                      product={productItem}
                      key={productItem?._id}
                      handleGetProductDetails={handleGetProductDetails}
                      handleAddToCart={handleAddToCart}
                    />
                  ))
                ) : (
                  <p>No products found</p>
                )}
              </Suspense>
            </div>
          </div>

          <Suspense fallback={<div>Loading Details...</div>}>
            <ProductDialog
              open={openDetailDialog}
              setOpen={setOpenDetailDialog}
              productDetails={productDetails}
              handleAddToCart={handleAddToCart}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ShoppingListing;
