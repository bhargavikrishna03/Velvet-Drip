export default function WhatsAppButton({dish,phoneNum}){
const text=encodeURIComponent(`Hii, I'd like to order: ${dish.name} (₹${dish.price})`);
return(
    <>
      <a href={`https://wa.me/${phoneNum}?text=${text}`} target="_blank" rel="noreferrer" 
      className="bg-green-500 text-white px-3 py-1 ronded-lg text-sm">Order on WhatsApp</a>
    </>
)
}