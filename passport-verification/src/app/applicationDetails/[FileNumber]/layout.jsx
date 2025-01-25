import React from 'react'
import Page from './page';


const layout = async ({ params }) => {
    const { FileNumber } = await params;
    return (
        <Page FileNumber={FileNumber} />
    )
}

export default layout
