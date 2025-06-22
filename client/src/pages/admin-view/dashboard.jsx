import { lazy, Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";
import { useDispatch, useSelector } from "react-redux";

// ✅ Lazy load image upload component
const ProductImageUpload = lazy(() => import("@/components/admin-view/image-upload"));

function AdminDashboard() {
  const [ImageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div>
      <Suspense fallback={<div>Loading Upload Component...</div>}>
        <ProductImageUpload
          ImageFile={ImageFile}
          setImageFile={setImageFile}
          uploadedImageUrl={uploadedImageUrl}
          setUploadedImageUrl={setUploadedImageUrl}
          setImageLoadingState={setImageLoadingState}
          imageLoadingState={imageLoadingState}
          isCustomStyling={true}
        />
      </Suspense>

      <Button
        onClick={handleUploadFeatureImage}
        className="mt-5 w-full"
        disabled={!uploadedImageUrl}
      >
        Upload
      </Button>

      <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((featureImgItem, index) => (
              <div className="relative" key={index}>
                <img
                  src={featureImgItem.image}
                  alt="Feature"
                  className="w-full h-[300px] object-cover rounded-t-lg"
                />
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export default AdminDashboard;
