import React from 'react';
import Head from 'next/head';

type SEOProps = {
    description?: string,
    author?: string,
    meta?: string,
    title?: string,
    icon?: string,
    image?: string | null,
    url?: string
}

export default function SEO(props: SEOProps) {
    const metaData = [
        {
            name: "type",
            property: `og:type`,
            content: `website`,
        },
    ]
    const image = props.image || ""
    
    return (
        <Head>
            <title>{props.title}</title>
            <link rel="icon" type="image/png" sizes="24x24" href={""} />

            <meta data-rh="true" content={image} property="og:image"></meta>

            <meta content={image} property="og:image:secure"></meta>

            <meta data-rh="true" content={image} property="twitter:image"></meta>

            <meta content={props.url} property="og:url"></meta>

            <meta content={props.description} property="og:description"></meta>

            <meta content={props.title} property="og:title"></meta>

            <meta content={props.description} property="twitter:description"></meta>

            <meta content={props.title} property="twitter:title"></meta>

            <meta content={props.author} property="twitter:creator"></meta>

            <meta content={"summary_large_image"} property="twitter:card"></meta>

            {metaData.map(({ name, content, property }, i) => (
                <meta key={i} name={name} property={property} content={content} />
            ))}
        </Head>
    );
}