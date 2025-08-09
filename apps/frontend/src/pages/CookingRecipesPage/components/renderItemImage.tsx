export const renderItemImage = (itemId: string, translation: string) => (
  <a
    href={`https://europe.albiononline2d.com/en/item/id/${itemId}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    <div className="relative group">
      <img
        src={`https://render.albiononline.com/v1/item/${itemId}.png`}
        alt={itemId}
        className="w-16 h-16 object-contain"
      />
      <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -mt-8">
        {translation}
      </span>
    </div>
  </a>
);
