import { CardsMap } from "./CardsMap";
import { CarouselsMap } from "./CarouselsMap";
import { HeroMap } from "./HeroMap";
import { TestimonialMap } from "./TestimonialsMap";
import { FAQMap } from "./FAQMap";
import { ContactFormMap } from "./ContactFormMap";
import { AboutUsMap } from "./AboutUsMap";
import { ProductListMap } from "./ProductListMap";

const ComponentMap = {
  ...Object.keys(AboutUsMap).reduce((acc, key) => {
    acc[key] = AboutUsMap[key];
    return acc;
  }, {} as Record<string, any>),
  ...Object.keys(CardsMap).reduce((acc, key) => {
    acc[key] = CardsMap[key];
    return acc;
  }, {} as Record<string, any>),
  ...Object.keys(CarouselsMap).reduce((acc, key) => {
    acc[key] = CarouselsMap[key];
    return acc;
  }, {} as Record<string, any>),
  ...Object.keys(ContactFormMap).reduce((acc, key) => {
    acc[key] = ContactFormMap[key];
    return acc;
  }, {} as Record<string, any>),
  ...Object.keys(FAQMap).reduce((acc, key) => {
    acc[key] = FAQMap[key];
    return acc;
  }, {} as Record<string, any>),
  ...Object.keys(HeroMap).reduce((acc, key) => {
    acc[key] = HeroMap[key];
    return acc;
  }, {} as Record<string, any>),
  ...Object.keys(TestimonialMap).reduce((acc, key) => {
    acc[key] = TestimonialMap[key];
    return acc;
  }, {} as Record<string, any>),
  ...Object.keys(ProductListMap).reduce((acc, key) => {
    acc[key] = ProductListMap[key];
    return acc;
  }, {} as Record<string, any>),
};

export default ComponentMap;
