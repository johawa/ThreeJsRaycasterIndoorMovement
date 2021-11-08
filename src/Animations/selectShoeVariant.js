export function selectShoeVariant(scene, parser, extension, variantName) {
  const variantIndex = extension.variants.findIndex((v) => v.name.includes(variantName));

  scene.traverse(async (object) => {
    if (!object.isMesh || !object.userData.gltfExtensions) return;

    const meshVariantDef = object.userData.gltfExtensions["KHR_materials_variants"];

    if (!meshVariantDef) return;

    if (!object.userData.originalMaterial) {
      object.userData.originalMaterial = object.material;
    }

    const mapping = meshVariantDef.mappings.find((mapping) => mapping.variants.includes(variantIndex));

    if (mapping) {
      object.material = await parser.getDependency("material", mapping.material);
      parser.assignFinalMaterial(object);
    } else {
      object.material = object.userData.originalMaterial;
    }
  });
}
