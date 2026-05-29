import { BlocksRenderer } from '@strapi/blocks-react-renderer';

 
// Converte o campo `description` do tipo `blocks` do Strapi em React.
// @param blocks - O array de blocos retornado pela API do Strapi
// @returns Componente React ou null

export function renderBlocks(blocks: any) {
  if (!blocks) return null;
  return <BlocksRenderer content={blocks} />;
}


// Para campos `richtext`, o Strapi devolve uma string HTML.
// @param html - String HTML
// @returns JSX com dangerouslySetInnerHTML


export function renderRichText(html: string) {
  if (!html) return null;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}