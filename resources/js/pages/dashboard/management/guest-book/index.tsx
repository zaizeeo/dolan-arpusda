import DashboardLayout from "@/components/layouts/dashboard-layout";
import { PageProps } from "@/types/page-props";

interface Props extends PageProps{
  guestBooks:Array<unknown>
}

const GuestBookIndex = (props:Props) => {
  console.log({guestBook:props.guestBooks});
  
  return (
    <DashboardLayout>GuestBookIndex</DashboardLayout>
  )
}

export default GuestBookIndex