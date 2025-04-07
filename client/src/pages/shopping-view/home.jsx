import { BabyIcon, Check, ChevronLeft, ChevronLeftIcon, ChevronRight, ChevronRightIcon, Dog, Footprints,  ShieldPlus,  ShirtIcon, Signature, Sofa, WandSparkles, WatchIcon, Weight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FetchFilteredProducts } from '@/store/shop/products-slice';
import ShoppingProductTile from '@/components/shopping-view/product-tile';
import { getFeatureImages } from '@/store/common-slice';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import img1 from '../../assets/nike.png';
import img2 from '../../assets/adidas.png';
import img3 from '../../assets/puma.png';
import img4 from '../../assets/levis.png';
import img5 from '../../assets/zara.png'
import img6 from '../../assets/h&m.png'
import cat1 from '../../assets/man.jpg'
import cat2 from '../../assets/women.webp'
import cat3 from '../../assets/kids.jpg'
import cat4 from '../../assets/accessories.jpg'
import cat5 from '../../assets/footwear.webp'







function ShoppingHome(){
    const navigate = useNavigate()
    const dispatch= useDispatch();
    const {productList}= useSelector(state=> state.shopProduct)
      const [currentSlide, setCurrentSlide]= useState(0);
      const { featureImageList } = useSelector((state) => state.commonFeature);
      const homepage=true;
     const category=[
        {id: "men", label:"Men", image: cat1 },
        {id: "women", label:"Women" ,image: cat2},
        {id: "kids", label:"Kids", image: cat3},
        {id: "accessories", label:"Acessories", image: cat4},
        {id: "footwear", label:"Footwear" ,image: cat5}
       ]
     const brand=[
        {id:'nike', label: "Nike", image: img1},
        {id:'adidas', label: "Adidas",image: img2},
        {id:'puma', label: "Puma", image: img3},
        {id:'levi', label: "Levi's", image: img4 },
        {id:'zara', label: "Zara", image: img5},
        {id:'h&m', label: "H&M", image: img6}
       ]

       useEffect(()=>{
              const timer= setInterval(() => {
                setCurrentSlide(prev=> (prev+1)%featureImageList.length);
                }, 3000);
                return ()=>clearInterval(timer);

       },[featureImageList])

       useEffect(()=>{
         dispatch(FetchFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" }))
       },[dispatch])

      

       function handleNavigateToListingPage(getCurrentItem, section){
        sessionStorage.removeItem("filters");
        const currentFilter= {
            [section]: [getCurrentItem.id],
        };
        sessionStorage.setItem('filters', JSON.stringify(currentFilter))
        navigate('/shop/listing')
       }

         useEffect(() => {
           dispatch(getFeatureImages());
         }, [dispatch]);
    
    return(
       <div className="flex flex-col min-h-screen mt-16">
        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[600px] overflow-hidden">
             {featureImageList.map && featureImageList.length >0 ? featureImageList.map((slide, index)=>
                   <img src={slide?.image} alt="banner-img" key={index}  className={`${index===currentSlide ? "opacity-100": "opacity-0"} absolute top-0 left-0 transition-opacity w-full h-full object-cover duration-100`}/>
             ): null
             }
            
            <Button variant="outline" size="icon" className="absolute top-1/2 left-4 tranform -translate-y-1/2 bg-white/80" onClick={()=> setCurrentSlide(prev=> (prev-1+featureImageList.length)%featureImageList.length)}>
                <ChevronLeftIcon className='w-4 h-4'/>
            </Button>
            <Button variant="outline" size="icon" className="absolute top-1/2 right-4 tranform -translate-y-1/2 bg-white/80" onClick={()=> setCurrentSlide(prev=> (prev+1)%featureImageList.length)}>
                <ChevronRightIcon className='w-4 h-4'/>
            </Button>
        </div>
    
        <section className='py-12 bg-slate-700 text-pink-50 mt-3 relative '>
  <div className='container mx-auto px-4'>
    <h2 className='text-3xl font-bold text-center mb-8'>
      Shop By Category
    </h2>

    {/* Custom arrows */}
    <div className="absolute top-1/2 -left-4 z-10 transform -translate-y-1/2">
      <button className="custom-swiper-prev bg-white text-black rounded-full p-2 shadow hover:bg-gray-200">
        <ChevronLeft size={24} className=' ml-4' />
      </button>
    </div>
    <div className="absolute top-1/2 -right-4 z-10 transform -translate-y-1/2">
      <button className="custom-swiper-next bg-white text-black rounded-full p-2 shadow hover:bg-gray-200">
        <ChevronRight size={24} className=' mr-4'/>
      </button>
    </div>

    <Swiper
      slidesPerView={2}
      spaceBetween={20}
      navigation={{
        prevEl: '.custom-swiper-prev',
        nextEl: '.custom-swiper-next',
      }}
      modules={[Navigation]}
      breakpoints={{
        640: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        1024: { slidesPerView: 5 },
      }}
    >
      {category.map((item, index) => {
        const Icon = item.icon;
        return (
          <SwiperSlide key={index}>
            <Card
              className="cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
              onClick={() => handleNavigateToListingPage(item, 'category')}
            >
              <CardContent className=" p-0 flex flex-col items-center pb-2 ">
              <img
                  src={item.image}
                  alt={item.label}
                  className="w-full h-[120px] object-cover rounded-t-lg"
                />
                <span className='font-bold'>{item.label}</span>
              </CardContent>
            </Card>
          </SwiperSlide>
        );
      })}
    </Swiper>
  </div>
</section>

<section className='py-12 relative'>
  <div className='container mx-auto px-4'>
    <h2 className='text-3xl font-bold text-center mb-8'>
      Featured Products
    </h2>

    {/* Custom Arrows */}
    <div className="absolute top-1/2 -left-4 z-10 transform -translate-y-1/2">
    <button className="custom-product-prev bg-white text-black rounded-full p-2 shadow hover:bg-gray-200 ml-4 lg:ml-12">
        <ChevronLeft size={24} />
      </button>
    </div>
    <div className="absolute top-1/2 -right-4 z-10 transform -translate-y-1/2">
      <button className="custom-product-next bg-white text-black rounded-full p-2 shadow hover:bg-gray-200 mr-4 lg:mr-12">
        <ChevronRight size={24} />
      </button>
    </div>

    <Swiper
      loop={true}
      slidesPerView={1}
      spaceBetween={20}
      navigation={{
        prevEl: '.custom-product-prev',
        nextEl: '.custom-product-next',
      }}
      modules={[Navigation]}
      breakpoints={{
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      }}
    >
      {
        productList && productList.length > 0 &&
        productList.map((productItem, index) => (
          <SwiperSlide key={index}>
            <div onClick={() => navigate('/shop/listing')} className="cursor-pointer">
              <ShoppingProductTile product={productItem} homepage={homepage} />
            </div>
          </SwiperSlide>
        ))
      }
    </Swiper>

    <div className="text-center mt-6">
      <Link to={'/shop/listing'} className="text-blue-600 hover:underline">
        Explore More
      </Link>
    </div>
  </div>
</section>

        <section className='py-12 bg-slate-700 text-pink-50 relative'>
  <div className='container mx-auto px-4'>
    <h2 className='text-3xl font-bold text-center mb-8'>
      Shop By Brand
    </h2>

    {/* Custom arrows */}
    <div className="absolute top-1/2 -left-4 z-10 transform -translate-y-1/2">
      <button className="custom-brand-prev bg-white text-black rounded-full p-2 shadow hover:bg-gray-200">
        <ChevronLeft size={24} className='ml-4' />
      </button>
    </div>
    <div className="absolute top-1/2 -right-4 z-10 transform -translate-y-1/2">
      <button className="custom-brand-next bg-white text-black rounded-full p-2 shadow hover:bg-gray-200">
        <ChevronRight size={24} className='mr-4'/>
      </button>
    </div>

    <Swiper
      slidesPerView={2}
      spaceBetween={20}
      navigation={{
        prevEl: '.custom-brand-prev',
        nextEl: '.custom-brand-next',
      }}
      modules={[Navigation]}
      breakpoints={{
        640: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        1024: { slidesPerView: 6 },
      }}
    >
      {brand.map((item, index) => {
        
        return (
            <SwiperSlide key={index}>
            <Card
              className="cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
              onClick={() => handleNavigateToListingPage(item, 'brand')}
            >
              <CardContent className="flex flex-col items-center p-4 ">
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full h-[80px] object-cover rounded-t-lg"
                />
                <span className="font-bold text-center">{item.label}</span>
              </CardContent>
            </Card>
          </SwiperSlide>
          
        );
      })}
    </Swiper>
  </div>
</section>
       
       </div>
        
    )
}

export default ShoppingHome;