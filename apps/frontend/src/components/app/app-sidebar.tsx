import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DollarSign } from "lucide-react";

const items = [
  {
    title: "Prices",
    icon: DollarSign,
    children: [
      {
        title: "Raw Resources",
        children: [
          { title: "Hide", url: "/prices/raw/hide" },
          { title: "Wood", url: "/prices/raw/wood" },
          { title: "Ore", url: "/prices/raw/ore" },
          { title: "Fiber", url: "/prices/raw/fiber" },
          { title: "Stone", url: "/prices/raw/stone" },
        ],
      },
      {
        title: "Refined Resources",
        children: [
          { title: "Leather", url: "/prices/refined/leather" },
          { title: "Planks", url: "/prices/refined/planks" },
          { title: "Metal Bars", url: "/prices/refined/metal-bars" },
          { title: "Cloth", url: "/prices/refined/cloth" },
          { title: "Blocks", url: "/prices/refined/blocks" },
        ],
      },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={item.title}>
                      <AccordionTrigger className="flex items-center gap-2">
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.title}</span>
                      </AccordionTrigger>
                      <AccordionContent className="pl-4">
                        {item.children?.map((category) => (
                          <Accordion
                            type="single"
                            collapsible
                            key={category.title}
                          >
                            <AccordionItem value={category.title}>
                              <AccordionTrigger className="text-sm font-medium">
                                {category.title}
                              </AccordionTrigger>
                              <AccordionContent className="space-y-1 pl-4">
                                {category.children?.map((res) => (
                                  <SidebarMenuButton asChild key={res.title}>
                                    <a
                                      href={res.url}
                                      className="text-muted-foreground text-sm hover:underline"
                                    >
                                      {res.title}
                                    </a>
                                  </SidebarMenuButton>
                                ))}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
