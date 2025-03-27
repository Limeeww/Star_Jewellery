import React from "react";
import { Product } from "../../types/product";
import Item from "../Item/Item";
interface RecentlyViewedProps {
  products: Product[];
}

function RecentlyViewed({ products } : RecentlyViewedProps) {
    return (
        <div>
            <h2 className="font-semibold text-lg mb-2">Recently Viewed</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {products.map(product => (
                    <Item key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}

export default RecentlyViewed;
