type MapLayer = {
  source?: string;
  "source-layer"?: string;
};

type MapLike = {
  getLayer: (layerId: string) => MapLayer | undefined;
  querySourceFeatures: (
    sourceId: string,
    options: { sourceLayer?: string }
  ) => Array<{ properties?: Record<string, string | undefined> }>;
};

const GetMapLayerSource = (map: MapLike, layerId: string) => {
  //Get Layer Details from Map
  const layerDetails = map.getLayer(layerId);

  //Validate layer and source
  if (!layerDetails) throw "No layer found";
  const layerSourceType = layerDetails.source;
  if (!layerSourceType) throw "No layer source found";

  const sourceLayerName = layerDetails["source-layer"];

  return sourceLayerName;
};

const GetMapLayerFeatures = (map: MapLike, layerId: string) => {
  //Get Layer Details from Map
  const layerDetails = map.getLayer(layerId);

  //Validate layer and source
  if (!layerDetails) throw "No layer found";
  const layerSourceType = layerDetails.source;
  if (!layerSourceType) throw "No layer source found";

  const sourceLayerName = layerDetails["source-layer"];

  //get all the markers of the layer
  const features = map.querySourceFeatures(layerSourceType, {
    sourceLayer: sourceLayerName,
  });
  if (!features) return null;

  return features;
};
//
const GetMapLayerProperties = (map: MapLike, layerId: string) => {
  //get all the features of the layer
  const features = GetMapLayerFeatures(map, layerId);
  if (!features) return null;
  const properties = features.map((feature) => feature.properties);

  return properties;
};

const GetDistinctMapLayerPropertyValues: (
  map: MapLike,
  layerId: string,
  property: string
) => string[] | undefined = (map: MapLike, layerId: string, property: string) => {
  const properties = GetMapLayerProperties(map, layerId);
  if (!properties) return;
  const values: string[] = properties.map((item) => item?.[property] || "");
  return [...new Set(values)]; // Return unique values using Set
};

const SearchMapFeatures = (
  map: MapLike,
  layerId: string,
  property: string,
  searchValue: string
) => {
  //get all the features of the layer
  const features = GetMapLayerFeatures(map, layerId);
  if (!features) return null;
  const values = features.filter(
    (item) => item.properties?.[property] === searchValue
  );

  return values;
};

export {
  GetDistinctMapLayerPropertyValues,
  GetMapLayerProperties,
  GetMapLayerSource,
  SearchMapFeatures,
};
