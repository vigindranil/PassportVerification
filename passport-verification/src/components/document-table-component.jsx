'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Eye, MapPin } from 'lucide-react'
import Image from 'next/image'
const DocumentTable = ({ documents, docPath }) => {
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isLocationDetailsModalOpen, setIsLocationDetailsModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState('');
    const [selectedLocationDetails, setSelectedLocationDetails] = useState('');
    const [type, setType] = useState('');
    return (
        <Card className="m-5">
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Document Type</TableHead>
                                <TableHead>File Type</TableHead>
                                <TableHead>Document Id Number</TableHead>
                                <TableHead>IP</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents?.map((doc, index) => (
                                <TableRow key={index}>
                                    <TableCell>{doc?.DocumentTypeName || '-'}</TableCell>
                                    <TableCell>{doc?.FileType || '-'}</TableCell>
                                    <TableCell>{doc?.IdNumber || '-'}</TableCell>
                                    <TableCell>{doc?.LocationIp || '-'}</TableCell>
                                    <TableCell className="flex justify-center">
                                        <button className='flex bg-blue-100 justify-center items-center p-1 m-1 rounded-md hover:bg-blue-200 text-sm' onClick={() => {
                                            setSelectedDoc(`${docPath}${doc?.DocumentPath}`);
                                            setType(doc?.FileType);
                                            setIsDetailsModalOpen(true);
                                        }}><Eye className='text-blue-600 mr-2 h-4 w-4' />File</button>
                                        <button className='flex bg-blue-100 justify-center items-center p-1 m-1 rounded-md hover:bg-blue-200 text-sm' onClick={() => {
                                            setSelectedLocationDetails(doc?.UserAgent ? JSON.parse(doc?.UserAgent) : "");
                                            setIsLocationDetailsModalOpen(true);
                                        }}><MapPin className='text-blue-600 mr-2 h-4 w-4' />Locational Details</button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {isDetailsModalOpen && (
                        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
                            <DialogContent className="w-full">
                                <DialogHeader>
                                    <DialogTitle>Document Preview</DialogTitle>
                                </DialogHeader>
                                <DialogDescription>
                                    These are the details of the file.
                                </DialogDescription>
                                <div className="space-y-2 h-full w-full">
                                    {type == 'image' ? <Image
                                        src={selectedDoc}
                                        width={500}
                                        height={500}
                                        alt="Picture of the author"
                                    /> : type == 'pdf' ?
                                        <embed
                                            src={selectedDoc}
                                            type="application/pdf"
                                            width="100%"
                                            height="100%"
                                        /> : 'No file selected'}
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                    {isLocationDetailsModalOpen && (
                        <Dialog open={isLocationDetailsModalOpen} onOpenChange={setIsLocationDetailsModalOpen}>
                            <DialogContent className="w-full">
                                <DialogHeader>
                                    <DialogTitle>Locational Details</DialogTitle>
                                </DialogHeader>
                                <DialogDescription>
                                    These are the details of the file's location when it was uploaded.
                                </DialogDescription>
                                <div className="space-y-2 h-full w-full">
                                    {selectedLocationDetails &&
                                        <div>
                                            <p>
                                                <span className='font-bold'>IP Address:</span> {selectedLocationDetails?.ip}
                                            </p>
                                            <p>
                                                <span className='font-bold'>City:</span> {selectedLocationDetails?.city}
                                            </p>
                                            <p>
                                                <span className='font-bold'>Region:</span> {selectedLocationDetails?.region}
                                            </p>
                                            <p>
                                                <span className='font-bold'>Country:</span> {selectedLocationDetails?.country}
                                            </p>
                                            <p>
                                                <span className='font-bold'>Postal:</span> {selectedLocationDetails?.postal}
                                            </p>
                                            <p>
                                                <span className='font-bold'>Timezone:</span> {selectedLocationDetails?.timezone}
                                            </p>
                                            <div><span className='font-bold'>Lat-Long:</span> {selectedLocationDetails?.loc}</div>
                                            <div><span className='font-bold'>Map:</span> <a className='text-blue-500 underline' href={`https://www.google.co.in/maps/@${selectedLocationDetails?.loc}`}>view in map</a></div>
                                        </div>
                                    }
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default DocumentTable
