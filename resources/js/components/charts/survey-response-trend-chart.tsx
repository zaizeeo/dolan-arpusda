import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { ChartNoAxesColumnIncreasing } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

export interface SurveyTrendItem {
    date: string;
    day_name: string;
    short_date: string;
    count: number;
}

interface Props {
    trend: SurveyTrendItem[];
}

const surveyTrendChartConfig = {
    count: {
        label: "Respon",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

export function SurveyResponseTrendChart({ trend }: Props) {
    const totalWeeklyResponses = trend.reduce((total, item) => total + item.count, 0);

    return (
        <Card className="border-border bg-card shadow-xs">
            <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
                <div>
                    <div className="flex items-center gap-2">
                        <ChartNoAxesColumnIncreasing className="size-5 text-primary" />
                        <CardTitle className="text-base font-semibold">Tren Respon 7 Hari Terakhir</CardTitle>
                    </div>
                    <CardDescription className="mt-1.5">Total {totalWeeklyResponses} respon dalam sepekan terakhir.</CardDescription>
                </div>
                <Badge variant="outline" className="shrink-0 text-xs">
                    7 Hari
                </Badge>
            </CardHeader>
            <CardContent className="pt-4">
                {trend.length === 0 || trend.every((item) => item.count === 0) ? (
                    <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                        Belum ada respon dalam 7 hari terakhir
                    </div>
                ) : (
                    <ChartContainer config={surveyTrendChartConfig} className="aspect-auto h-64 w-full">
                        <AreaChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="fillSurveyResponses" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.35} />
                                    <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.03} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="short_date" tickLine={false} axisLine={false} tickMargin={10} />
                            <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                            <Area type="monotone" dataKey="count" stroke="var(--color-count)" strokeWidth={2} fill="url(#fillSurveyResponses)" />
                        </AreaChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}
