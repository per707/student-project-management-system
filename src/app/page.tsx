"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

// shadcn/ui components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Lucide icons
import {
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FolderKanban,
  Users,
  Plus,
  Server,
  Layers,
  Sparkles,
  ExternalLink,
  Search,
} from "lucide-react"

interface ProjectItem {
  id: string
  title: string
  leader: string
  avatar: string
  status: "In Progress" | "Completed" | "Planning"
  progress: number
  description: string
}

export default function HomePage() {
  const [supabaseStatus, setSupabaseStatus] = useState<
    "checking" | "connected" | "error"
  >("checking")
  const [statusMessage, setStatusMessage] = useState<string>("กำลังตรวจสอบการเชื่อมต่อ...")
  const [latency, setLatency] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Initial projects list for UI demo
  const [projects, setProjects] = useState<ProjectItem[]>([
    {
      id: "PRJ-001",
      title: "ระบบบริหารจัดการโครงงานนักศึกษา (Student Project Hub)",
      leader: "กิตติพงษ์ ใจดี",
      avatar: "KT",
      status: "In Progress",
      progress: 68,
      description: "ระบบติดตามสถานะและการส่งเอกสารโครงงานนักศึกษา",
    },
    {
      id: "PRJ-002",
      title: "AI ตรวจจับข้อผิดพลาดในเอกสารวิจัย",
      leader: "วรรณิศา ศรีสุข",
      avatar: "WN",
      status: "Completed",
      progress: 100,
      description: "เครื่องมือวิเคราะห์ไวยากรณ์และรูปแบบเอกสารวิชาการ",
    },
    {
      id: "PRJ-003",
      title: "แอปพลิเคชันจองห้องปฏิบัติการคอมพิวเตอร์",
      leader: "ปัญญวัฒน์ ชื่นชม",
      avatar: "PY",
      status: "Planning",
      progress: 25,
      description: "ระบบจองห้องแล็บและยืมคืนอุปกรณ์ไอที",
    },
  ])

  // New project dialog form state
  const [newTitle, setNewTitle] = useState("")
  const [newLeader, setNewLeader] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const checkConnection = async () => {
    setSupabaseStatus("checking")
    setStatusMessage("กำลังส่งคำขอทดสอบไปยัง Supabase...")
    const start = performance.now()
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getSession()
      const end = performance.now()
      setLatency(Math.round(end - start))

      if (error) {
        setSupabaseStatus("error")
        setStatusMessage(`เกิดข้อผิดพลาด: ${error.message}`)
      } else {
        setSupabaseStatus("connected")
        setStatusMessage("เชื่อมต่อกับ Supabase เรียบร้อยแล้ว (Session Ready)")
      }
    } catch (err: unknown) {
      setSupabaseStatus("error")
      setStatusMessage(
        err instanceof Error ? err.message : "ไม่สามารถเชื่อมต่อกับ Supabase ได้"
      )
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  const handleCreateProject = () => {
    if (!newTitle.trim()) return
    const newProj: ProjectItem = {
      id: `PRJ-${String(projects.length + 1).padStart(3, "0")}`,
      title: newTitle,
      leader: newLeader || "นักศึกษา",
      avatar: (newLeader || "ST").substring(0, 2).toUpperCase(),
      status: "Planning",
      progress: 10,
      description: newDesc,
    }
    setProjects([newProj, ...projects])
    setNewTitle("")
    setNewLeader("")
    setNewDesc("")
    setIsDialogOpen(false)
  }

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.leader.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "Not configured"

  return (
    <main className="min-h-screen bg-linear-to-b from-background to-muted/20 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                <FolderKanban className="size-5" />
              </span>
              <h1 className="text-2xl font-bold tracking-tight">
                Student Project Management System
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              ทดสอบการทำงานของ Shadcn/UI Components และ Supabase SSR Client
            </p>
          </div>

          {/* Connection Status Badge */}
          <div className="flex items-center gap-2">
            {supabaseStatus === "connected" && (
              <Badge variant="outline" className="border-emerald-500/40 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                Supabase Connected
              </Badge>
            )}
            {supabaseStatus === "checking" && (
              <Badge variant="secondary" className="animate-pulse">
                <RefreshCw className="size-3.5 animate-spin" />
                Connecting...
              </Badge>
            )}
            {supabaseStatus === "error" && (
              <Badge variant="destructive">
                <AlertCircle className="size-3.5" />
                Connection Error
              </Badge>
            )}
          </div>
        </header>

        {/* Top Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">โครงงานทั้งหมด</CardTitle>
              <FolderKanban className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
              <p className="text-xs text-muted-foreground mt-1">+1 โครงงานในสัปดาห์นี้</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">นักศึกษาในระบบ</CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12 คน</div>
              <p className="text-xs text-muted-foreground mt-1">แบ่งเป็น 3 กลุ่มโครงงาน</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">ความคืบหน้ารวม</CardTitle>
              <Sparkles className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">64%</div>
              <div className="mt-2">
                <Progress value={64} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">สถานะ Supabase SSR</CardTitle>
              <Database className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latency !== null ? `${latency} ms` : "..."}
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {supabaseStatus === "connected" ? "พร้อมใช้งาน Client & Server" : "กำลังตรวจสอบ"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">รายการโครงงาน (Table & UI)</TabsTrigger>
            <TabsTrigger value="supabase">การเชื่อมต่อ Supabase</TabsTrigger>
            <TabsTrigger value="components">UI Components Test</TabsTrigger>
          </TabsList>

          {/* TAB 1: Projects Table */}
          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>รายการโครงงานนักศึกษา</CardTitle>
                    <CardDescription>
                      ทดสอบการแสดงผล Table, Progress, Badge, Avatar และ Dialog
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative w-48 sm:w-64">
                      <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                      <Input
                        placeholder="ค้นหาโครงงานหรือชื่อ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>

                    {/* Dialog: Create Project */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger render={<Button className="gap-1.5" />}>
                        <Plus className="size-4" />
                        เพิ่มโครงงาน
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>เพิ่มโครงงานนักศึกษาใหม่</DialogTitle>
                          <DialogDescription>
                            กรอกรายละเอียดโครงงานเพื่อเพิ่มลงในระบบทดสอบ
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium">ชื่อโครงงาน</label>
                            <Input
                              placeholder="เช่น Web Application for Smart Farm"
                              value={newTitle}
                              onChange={(e) => setNewTitle(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium">หัวหน้ากลุ่ม / ผู้รับผิดชอบ</label>
                            <Input
                              placeholder="เช่น นายสมคิด เรียนดี"
                              value={newLeader}
                              onChange={(e) => setNewLeader(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium">รายละเอียดสังเขป</label>
                            <Textarea
                              placeholder="ระบุขอบเขตและวัตถุประสงค์โดยย่อ..."
                              value={newDesc}
                              onChange={(e) => setNewDesc(e.target.value)}
                              rows={3}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose render={<Button variant="outline" />}>
                            ยกเลิก
                          </DialogClose>
                          <Button onClick={handleCreateProject}>บันทึกโครงงาน</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">รหัส</TableHead>
                      <TableHead>ชื่อโครงงาน</TableHead>
                      <TableHead>หัวหน้ากลุ่ม</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead className="w-44">ความคืบหน้า</TableHead>
                      <TableHead className="text-right">การจัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          ไม่พบโครงงานที่ตรงกับคำค้นหา
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProjects.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-mono text-xs font-semibold">
                            {p.id}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{p.title}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {p.description}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar size="sm">
                                <AvatarFallback>{p.avatar}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{p.leader}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {p.status === "Completed" && (
                              <Badge variant="outline" className="border-emerald-500/50 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20">
                                เสร็จสิ้น
                              </Badge>
                            )}
                            {p.status === "In Progress" && (
                              <Badge variant="secondary">กำลังดำเนินการ</Badge>
                            )}
                            {p.status === "Planning" && (
                              <Badge variant="outline">วางแผน</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>ความคืบหน้า</span>
                                <span>{p.progress}%</span>
                              </div>
                              <Progress value={p.progress} />
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="xs">
                              ดูรายละเอียด
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: Supabase SSR Verification */}
          <TabsContent value="supabase" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="size-5 text-primary" />
                      Supabase Client & Server Connection Status
                    </CardTitle>
                    <CardDescription>
                      ทดสอบการเชื่อมต่อกับ Supabase ผ่าน Client-side SDK และตรวจเช็คการตั้งค่า ENV
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={checkConnection}
                    disabled={supabaseStatus === "checking"}
                    className="gap-1.5"
                  >
                    <RefreshCw className={`size-3.5 ${supabaseStatus === "checking" ? "animate-spin" : ""}`} />
                    ทดสอบเชื่อมต่อใหม่
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border p-4 bg-muted/30 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        Supabase Project URL
                      </div>
                      <div className="font-mono text-sm mt-0.5">{supabaseUrl}</div>
                    </div>
                    {supabaseStatus === "connected" ? (
                      <Badge variant="outline" className="text-emerald-600 border-emerald-500/30">
                        Online
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Status: {supabaseStatus}</Badge>
                    )}
                  </div>

                  <div className="border-t pt-3">
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      ข้อความตอบกลับ
                    </div>
                    <p className="text-sm mt-0.5">{statusMessage}</p>
                    {latency !== null && (
                      <p className="text-xs text-muted-foreground mt-1">
                        เวลาตอบสนอง: {latency} ms
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 font-medium">
                      <Layers className="size-4 text-primary" />
                      Browser Client (`src/lib/supabase/client.ts`)
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      ใช้ <code>createBrowserClient</code> จาก <code>@supabase/ssr</code> สำหรับ React Client Components เพื่อจัดการ Auth และ Realtime ใน Browser
                    </p>
                  </div>

                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 font-medium">
                      <Server className="size-4 text-primary" />
                      Server Client (`src/lib/supabase/server.ts`)
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      ใช้ <code>createServerClient</code> ร่วมกับ <code>cookies()</code> ของ Next.js App Router (รองรับ asynchronous cookie storage) ตามมาตรฐานล่าสุด
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <span className="text-xs text-muted-foreground">
                  Configuration source: <code>.env.local</code>
                </span>
                <a
                  href="https://supabase.com/docs/guides/auth/server-side/nextjs"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary flex items-center gap-1 hover:underline"
                >
                  Supabase SSR Documentation
                  <ExternalLink className="size-3" />
                </a>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* TAB 3: Component Showcase */}
          <TabsContent value="components" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Shadcn UI Components Showcase</CardTitle>
                <CardDescription>
                  ทดสอบคอมโพเนนต์ครบทั้ง 10 ตัวตามที่ร้องขอ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 1. Buttons */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">1. Button Variants</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="default">Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                  </div>
                </div>

                {/* 2. Badges */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">2. Badge Variants</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">Primary Badge</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>
                </div>

                {/* 3. Input & Textarea */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">3. Input</h4>
                    <Input placeholder="กรอกข้อความทดสอบ..." />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">4. Textarea</h4>
                    <Textarea placeholder="กรอกข้อความหลายบรรทัด..." rows={2} />
                  </div>
                </div>

                {/* 5. Progress */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">5. Progress Bar</h4>
                  <div className="space-y-1">
                    <Progress value={75} />
                    <p className="text-xs text-muted-foreground text-right">75% Complete</p>
                  </div>
                </div>

                {/* 6. Avatar */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">6. Avatar</h4>
                  <div className="flex items-center gap-3">
                    <Avatar size="lg">
                      <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Avatar size="default">
                      <AvatarFallback>SP</AvatarFallback>
                    </Avatar>
                    <Avatar size="sm">
                      <AvatarFallback>AB</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">Sizes: Large, Default, Small</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
