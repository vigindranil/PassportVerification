"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"

// const formSchema = z.object({
//   applicationNumber: z.string().min(1, "Application number is required"),
//   additionalFees: z.string().optional(),
//   query: z.string().min(1, "Query is required"),
//   sectionNumber: z.string().min(1, "Section number is required"),
//   finalAnswer: z.string().min(1, "Final answer is required"),
// })

const draftApplications = [
  { id: 1, applicationNo: "APP001", receiveDate: "2023-05-01", applicationDate: "2023-04-28" },
  { id: 2, applicationNo: "APP002", receiveDate: "2023-05-03", applicationDate: "2023-04-30" },
  { id: 3, applicationNo: "APP003", receiveDate: "2023-05-05", applicationDate: "2023-05-02" },
]

export default function FinalAnswerForm() {
  const [user, setUser] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const router = useRouter()

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       additionalFees: "",
//     },
//   })

//   useEffect(() => {
//     const token = localStorage.getItem("token")
//     if (!token) {
//       router.push("/")
//       return
//     }

//     const userInfo = {
//       user_name: localStorage.getItem("user_name") || "",
//       email: localStorage.getItem("email") || "",
//       role: localStorage.getItem("role") || "",
//       id: localStorage.getItem("id") || "",
//     }

//     if (Object.values(userInfo).every((value) => value)) {
//       setUser(userInfo)
//     } else {
//       console.error("User information is incomplete")
//       router.push("/")
//     }
//   }, [router])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
    localStorage.setItem("darkMode", (!darkMode).toString())
  }

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  function onSubmit(values) {
    console.log(values)
  }

  function onSaveAsDraft() {
    console.log("Saving as draft:", form.getValues())
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      {/* <TopNav user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> */}
      <main className="container mx-auto px-4 py-8">
        {/* <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/add">
                <ArrowLeft className="h-6 w-6" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Final Answer</h1>
              <p className="mt-1 text-gray-500 dark:text-gray-400">Add final answer for applications</p>
            </div>
          </div>
        </div> */}

        {/* <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <h2 className="text-2xl font-bold text-white">Final Answer Form</h2>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="applicationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Application Number*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="--Select--" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="APP001">APP001</SelectItem>
                          <SelectItem value="APP002">APP002</SelectItem>
                          <SelectItem value="APP003">APP003</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalFees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Fees</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Additional Fees (If Any)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="query"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Query*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="query1">Query 1</SelectItem>
                          <SelectItem value="query2">Query 2</SelectItem>
                          <SelectItem value="query3">Query 3</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sectionNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Section Number</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="section1">Section 1</SelectItem>
                          <SelectItem value="section2">Section 2</SelectItem>
                          <SelectItem value="section3">Section 3</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="finalAnswer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Final Answer*</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter Final Answer" {...field} className="min-h-[100px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={onSaveAsDraft}>
                  Save As Draft
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </div> */}

        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
            <h2 className="text-2xl font-bold text-white">DRAFT APPLICATION LIST</h2>
          </div>
          <div className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sl. No.</TableHead>
                  <TableHead>Application No.</TableHead>
                  <TableHead>Application Receive Date</TableHead>
                  <TableHead>Application Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {draftApplications.map((app, index) => (
                  <TableRow key={app.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{app.applicationNo}</TableCell>
                    <TableCell>{app.receiveDate}</TableCell>
                    <TableCell>{app.applicationDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-between items-center">
              <div>
                Page Limit:
                <Select defaultValue="10">
                  <SelectTrigger className="w-[70px] ml-2">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Pagination />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

