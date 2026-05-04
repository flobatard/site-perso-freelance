import { ComponentType } from "react";
import ShowcaseSite from "./ShowcaseSite";
import EcommerceSite from "./EcommerceSite";

const offeringContents: Record<string, ComponentType> = {
  showcase_site: ShowcaseSite,
  ecommerce_site: EcommerceSite,
};

export default offeringContents;
