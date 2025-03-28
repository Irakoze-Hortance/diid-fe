'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../components/ui/table"
import { Button } from "../../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,DialogDescription,DialogFooter,DialogClose } from "../../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAllStudents, getAllTeachers, updateUser, deleteUser } from "../../lib/api";
import { Users, GraduationCap, Eye, Pencil, Trash2 } from "lucide-react"
import { User } from "../../types";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { useState } from "react"
import { toast } from "sonner";
export default function UsersManagement() {
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { 
    data: teachers, 
    isLoading: isTeachersLoading 
  } = useQuery({
    queryKey: ['teachers'],
    queryFn: getAllTeachers
  });

  const { 
    data: students, 
    isLoading: isStudentsLoading 
  } = useQuery({
    queryKey: ['students'],
    queryFn: getAllStudents
  });


  const ViewUserDialog = ({ user }: { user: User }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>Detailed information about the user</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Full Name</Label>
            <span className="col-span-3">{`${user.firstName} ${user.lastName}`}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Email</Label>
            <span className="col-span-3">{user.email}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Age Group</Label>
            <span className="col-span-3">{user.ageGroup}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Created At</Label>
            <span className="col-span-3">{new Date(user.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const EditUserDialog = ({ user }: { user: User }) => {
    const [localUser, setLocalUser] = useState({ ...user });



    return (
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setEditingUser(user)}>
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Make changes to user information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">First Name</Label>
              <Input 
                id="firstName" 
                value={localUser.firstName} 
                onChange={(e) => setLocalUser({...localUser, firstName: e.target.value})}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">Last Name</Label>
              <Input 
                id="lastName" 
                value={localUser.lastName} 
                onChange={(e) => setLocalUser({...localUser, lastName: e.target.value})}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input 
                id="email" 
                value={localUser.email} 
                onChange={(e) => setLocalUser({...localUser, email: e.target.value})}
                className="col-span-3" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Delete User Dialog
  const DeleteUserDialog = ({ user }: { user: User }) => {
  
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="icon" className="h-8 w-8">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user 
              account for {`${user.firstName} ${user.lastName}`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction >Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  const renderUserTable = (users: User[], type: 'teachers' | 'students') => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Age Group</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users?.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.ageGroup}</TableCell>
            <TableCell>
              {new Date(user.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <ViewUserDialog user={user} />
                <EditUserDialog user={user} />
                <DeleteUserDialog user={user} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  if (isTeachersLoading || isStudentsLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex">
      <AdminSidebar />
      
      <main className="flex-1 p-8 mt-8 ml-64">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teachers?.length || 0}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{students?.length || 0}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="teachers" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="teachers">Teachers</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
            </TabsList>
            
            <TabsContent value="teachers">
              {renderUserTable(teachers || [], 'teachers')}
            </TabsContent>
            
            <TabsContent value="students">
              {renderUserTable(students || [], 'students')}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}