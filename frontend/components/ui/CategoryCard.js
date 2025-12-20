import React from "react";
import { ArrowRight, Star } from "@mui/icons-material";
import Link from "next/link";
import { Card, CardContent, Badge } from "@mui/material";


const COLORS = {
  primary: "#C9B59C",
  lightBg: "#F9F8F6",
  secondaryBg: "#EFE9E3",
  border: "#D9CFC7",
  text: "#5D4037",
  textLight: "#8D6E63",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
};

const CategoryCard = ({ category, featured = false, viewMode = "grid" }) => {
  return (
    <Link href={`/categories/${category.id}/products`} className="group block">
      {" "}
      {/* URL CHANGE */}
      <Card
        className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full border"
        style={{
          backgroundColor: "white",
          borderColor: COLORS.border,
        }}
      >
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={category.image || "/images/category-placeholder.jpg"}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {featured && (
            <Badge
              className="absolute top-3 right-3 border-0"
              style={{
                backgroundColor: COLORS.warning,
                color: "white",
              }}
            >
              <Star className="w-3 h-3 mr-1 fill-current" />
              Featured
            </Badge>
          )}

          <div
            className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
            style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          >
            <div className="flex items-center justify-between text-white">
              <span className="text-sm font-medium">View Products</span>{" "}
              {/* TEXT CHANGE */}
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3
              className="font-bold text-lg group-hover:transition-colors"
              style={{
                color: COLORS.text,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = COLORS.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = COLORS.text;
              }}
            >
              {category.name}
            </h3>
            <Badge
              variant="secondary"
              className="text-xs shrink-0"
              style={{
                backgroundColor: COLORS.secondaryBg,
                color: COLORS.text,
              }}
            >
              {category.productCount || category.products?.length || "0"}{" "}
              products {/* COUNT DISPLAY */}
            </Badge>
          </div>
          <p
            className="text-sm line-clamp-2"
            style={{ color: COLORS.textLight }}
          >
            {category.description ||
              "Explore our premium collection of products in this category."}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;
