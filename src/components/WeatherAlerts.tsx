
import React from "react";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface WeatherAlert {
  headline: string;
  severity: string;
  event: string;
  effective: string;
  expires: string;
  desc: string;
}

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
}

const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  return (
    <Card className="bg-destructive/5 border-destructive/20">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold flex items-center mb-2">
          <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
          Weather Alerts ({alerts.length})
        </h3>
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <Collapsible key={index} className="border border-destructive/20 rounded-md">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full flex justify-between items-center p-3 h-auto">
                  <div className="flex items-center text-left">
                    <div className="mr-2">
                      <span className="font-medium">{alert.headline || alert.event}</span>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-3 pt-0 text-sm">
                <div className="space-y-2">
                  <p><strong>Event:</strong> {alert.event}</p>
                  <p><strong>Severity:</strong> {alert.severity}</p>
                  <p><strong>Effective:</strong> {new Date(alert.effective).toLocaleString()}</p>
                  <p><strong>Expires:</strong> {new Date(alert.expires).toLocaleString()}</p>
                  <p>{alert.desc}</p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherAlerts;
