// Dans NavSettings.jsx
"use client";
import React, { useState } from "react";
import { SidebarGroup, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { ModeToggle } from "../../hooks/mode-toggle"; 
import { Button } from "@/components/ui/button";

export function NavSettings({ mapRef }) {
  const [showTrails, setShowTrails] = useState(true);

  const toggleTrails = () => {
    setShowTrails((prev) => {
      const newVal = !prev;
      if (mapRef && mapRef.current && mapRef.current.isStyleLoaded()) {
        mapRef.current.setLayoutProperty(
          "road-path",
          "visibility",
          newVal ? "visible" : "none"
        );
      }
      return newVal;
    });
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex flex-col gap-2 p-2">
            <div className="flex flex-col items-center justify-between">
              <span className="text-sm">Mode sombre :</span>
              <ModeToggle />

              <span className="text-sm mt-2">Afficher les sentiers :</span>
              <Button variant="outline" size="sm" onClick={toggleTrails}>
                {showTrails ? "Masquer" : "Afficher"}
              </Button>
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
