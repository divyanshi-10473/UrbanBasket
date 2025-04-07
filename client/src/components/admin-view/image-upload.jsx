import { useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { UploadCloudIcon } from "lucide-react";
import { FileIcon } from "lucide-react";
import { XIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import axios from "axios";

function ProductImageUpload({ImageFile, setImageFile, uploadedImageUrl, setUploadedImageUrl,setImageLoadingState,ImageLoadingState, isEditMode , isCustomStyling=false}){
    
    const inputRef =useRef(null);

    function handleImageChange(event){
        console.log(event.target.files);
        const selectedFile =event.target.files?.[0];
        console.log(selectedFile);

        if (selectedFile) setImageFile(selectedFile);
    }
    function handleDragOver(event){
             event.preventDefault();
    }
    function handleDrop(event){
             event.preventDefault();
             const droppedFile=event.dataTransfer.files?.[0];
             if(droppedFile) setImageFile(droppedFile)
    }
function handleRemoveImage(){
    setImageFile(null);
    if(inputRef.current){
        inputRef.current.value="";
    }
}

async function uploadImageToCloudinary(){
    setImageLoadingState(true);
    const data= new FormData();
    data.append("my_file", ImageFile);
    const response =await axios.post('http://localhost:5000/api/admin/products/upload-image', data);
    console.log(response , "response")
    if(response?.data?.success) {
        setUploadedImageUrl(response.data.result.url);
        setImageLoadingState(false);
    }
}

useEffect(()=>{
    if(ImageFile!== null) uploadImageToCloudinary();
},[ImageFile])



    return(
    <div className={` w-full  mt-4" ${isCustomStyling ?'': 'max-w-md mx-auto' }`}>
            <Label className="text-lg font-semibold mb-2 block"> Upload Image
                <div className={`${isEditMode ? "opacity-60": ""} border-2 rounded-lg p-4`} onDragOver={handleDragOver} onDrop={handleDrop} >
                    <Input id="image-upload" type="file" onChange={handleImageChange} ref={inputRef} className="hidden " disabled={isEditMode}/>
                    {
                        !ImageFile ? (<Label htmlFor= "image-upload" className={ `${isEditMode ? "cursor-not-allowed": "cursor-pointer"} flex flex-col items-center justify-center h-32  `}>
                            <UploadCloudIcon className="w-10 h-10 text-muted-foreground"/>
                            <span>Drag & drop or click to upload image</span>
                        </Label> ):( 
                            ImageLoadingState ? <Skeleton className='h-10 bg-gray-100'/>:
                            <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <FileIcon className=" w-8 text-primary mr-2 h-8" />
                            </div>
                            <p className="text-sm font-medium">{ImageFile.name}</p>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground"  onClick={handleRemoveImage}> 
                                <XIcon className="w-4 h-4" />
                                <span className="sr-only">Remove File</span>
                            </Button>
                        </div>)

                    }
                </div>
            </Label>
           

        </div>
    )
}

export default ProductImageUpload;