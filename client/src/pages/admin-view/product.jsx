import { Fragment, useEffect, useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import CommonForm from "@/components/common/form";
import { addProductFormElements } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewProduct,
  DeleteProduct,
  EditProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import Swal from "sweetalert2";
import { useToast } from "@/hooks/use-toast";

// ✅ Lazy load heavy components
const ProductImageUpload = lazy(() => import("@/components/admin-view/image-upload"));
const AdminProductTile = lazy(() => import("@/components/admin-view/product-tile"));

const initialFormData = {
  image: null,
  title: '',
  description: '',
  category: '',
  brand: '',
  price: "",
  salePrice: '',
  totalStock: ''
};

function AdminProduct() {
  const [openCreateProd, setOpenCreateProd] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [ImageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.adminProduct);
  const { toast } = useToast();

  async function handleDelete(isDeleteId) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    dispatch(DeleteProduct(isDeleteId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({
          title: "Product deleted successfully",
          className: "bg-black text-white",
        });
      }
    });
  }

  async function onSubmit(event) {
    event.preventDefault();

    if (currentEditId) {
      const data = await dispatch(EditProduct({ id: currentEditId, formData }));
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({
          title: 'Product edited successfully',
          className: "bg-black text-white",
        });
        setOpenCreateProd(false);
        setFormData(initialFormData);
      }
    } else {
      const data = await dispatch(addNewProduct({ ...formData, image: uploadedImageUrl }));
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        setImageFile(null);
        setFormData(initialFormData);
        setOpenCreateProd(false);
        toast({
          title: 'Product added successfully',
          className: "bg-black text-white",
        });
      }
    }
  }

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="mb-5 flex justify-end w-full">
        <Button onClick={() => setOpenCreateProd(true)}>Add New Product</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <Suspense fallback={<div>Loading products...</div>}>
          {productList?.data && productList?.data.length > 0 ? (
            productList?.data.map((productItem, indx) => (
              <AdminProductTile
                key={indx}
                product={productItem}
                setCurrentEditId={setCurrentEditId}
                setFormData={setFormData}
                setOpenCreateProd={setOpenCreateProd}
                handleDelete={handleDelete}
              />
            ))
          ) : (
            "NO PRODUCT FOUND"
          )}
        </Suspense>
      </div>

      <Sheet
        open={openCreateProd}
        onOpenChange={() => {
          setOpenCreateProd(false);
          setFormData(initialFormData);
          setCurrentEditId(null);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditId ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>

          <Suspense fallback={<div>Loading image uploader...</div>}>
            <ProductImageUpload
              isEditMode={currentEditId !== null}
              ImageFile={ImageFile}
              setImageFile={setImageFile}
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
              setImageLoadingState={setImageLoadingState}
              imageLoadingState={imageLoadingState}
            />
          </Suspense>

          <div className="py-6">
            <CommonForm
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditId ? 'Edit Product' : 'Add Product'}
              formControls={addProductFormElements}
              onSubmit={onSubmit}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProduct;
