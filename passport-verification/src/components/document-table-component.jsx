'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Eye } from 'lucide-react'
import Image from 'next/image'
const DocumentTable = ({ documents, docPath }) => {
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState('');
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
                                <TableHead>Latitude</TableHead>
                                <TableHead>Longitude</TableHead>
                                <TableHead>IP</TableHead>
                                <TableHead>Document Path</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents?.map((doc, index) => (
                                <TableRow key={index}>
                                    <TableCell>{doc?.DocumentTypeName || '-'}</TableCell>
                                    <TableCell>{doc?.FileType || '-'}</TableCell>
                                    <TableCell>{doc?.Latitude || '-'}</TableCell>
                                    <TableCell>{doc?.Longitude || '-'}</TableCell>
                                    <TableCell>{doc?.LocationIp || '-'}</TableCell>
                                    <TableCell>
                                        <button className='flex bg-blue-100 justify-center items-center p-2 rounded-md hover:bg-blue-200' onClick={() => {
                                            setSelectedDoc(`${docPath}${doc?.DocumentPath}`);
                                            setType(doc?.FileType);
                                            setIsDetailsModalOpen(true);
                                        }}><Eye className='text-blue-600 mr-2' /> View File</button>
                                        {/* <a href={`${docPath}${doc?.DocumentPath}`}><Eye className='text-blue-600' /></a> */}
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
                </div>
            </CardContent>
        </Card>
    )
}

export default DocumentTable
