"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { getPoliceStationsByDsId, showDistrict } from "@/app/allFiles-sp/api"
import Cookies from "react-cookies"

export function TransferModal({ isOpen, onClose, fileNumber, applicantName, onTransfer }) {
  const [remarks, setRemarks] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectedPoliceStation, setSelectedPoliceStation] = useState("")
  const [districts, setDistricts] = useState([])
  const [policeStations, setPoliceStations] = useState([])
  const ds_id = Cookies.load("ds_id")

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await showDistrict()
        setDistricts(response.data)
        setSelectedDistrict(ds_id)
      } catch (error) {
        console.log("Error fetching application status:", error)
      }
    }
    fetchDistricts()
    setPoliceStations([])
  }, [])

  useEffect(() => {
    const fetchPoliceStations = async () => {
      if (selectedDistrict) {
        try {
          const response = await getPoliceStationsByDsId(selectedDistrict)
          setPoliceStations(response.data)
        } catch (error) {
          console.log("Error fetching police stations:", error)
        }
      } else {
        setPoliceStations([])
      }
    }

    fetchPoliceStations()
  }, [selectedDistrict])


    const transferapplication = async () => {
      try {
        onTransfer(fileNumber, remarks, selectedDistrict, selectedPoliceStation)
      } catch (error) {
        console.log("Error transferring application:", error)
      }
    }

 
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Application</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            <strong>File Number:</strong> {fileNumber}
          </p>
          <p>
            <strong>Applicant Name:</strong> {applicantName}
          </p>
          <p>Are you sure you want to transfer this file?</p>
          <div className="space-y-2">
            <Label htmlFor="district">District</Label>
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict} disabled>
              <SelectTrigger id="district" disabled>
                <SelectValue placeholder="Select a district" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district.districtId} value={district.districtId.toString()} disabled>
                    {district.districtName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="policeStation">Police Station</Label>
            <Select value={selectedPoliceStation} onValueChange={setSelectedPoliceStation}>
              <SelectTrigger id="policeStation">
                <SelectValue placeholder="Select a police station" />
              </SelectTrigger>
              <SelectContent>
                {policeStations.map((station) => (
                  <SelectItem key={station.psm_id} value={station.psm_id.toString()}>
                    {station.psm_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Textarea placeholder="Enter remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={transferapplication}>
            Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

