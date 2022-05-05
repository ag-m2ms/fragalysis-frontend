import { Link, Typography } from '@material-ui/core';
import React from 'react';
import { DialogSection } from '../../../../../common/components/DialogSection';
import { DialogSectionHeading } from '../../../../../common/components/DialogSectionHeading';

export const ProductSection = ({ product }) => {
  const productpubcheminfo = product.productpubcheminfo || {};

  return (
    <DialogSection>
      <DialogSectionHeading>Product</DialogSectionHeading>
      <Typography>
        Smiles: <strong>{product.smiles}</strong>
      </Typography>
      {productpubcheminfo.cas && (
        <Typography>
          CAS number: <strong>{productpubcheminfo.cas}</strong>
        </Typography>
      )}
      {!!productpubcheminfo.compoundsummarylink && (
        <Link href={productpubcheminfo.compoundsummarylink} target="_blank" rel="noreferrer">
          PubChem compound summary
        </Link>
      )}
      {!!productpubcheminfo.lcsslink && (
        <Link href={productpubcheminfo.lcsslink} target="_blank" rel="noreferrer">
          Laboratory chemical safety summary
        </Link>
      )}
    </DialogSection>
  );
};
