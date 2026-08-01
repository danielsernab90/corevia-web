import { Module } from "@nestjs/common";

import { DatabaseModule } from "./database/database.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { ConsultationsModule } from "./modules/consultations/consultations.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { IntegrationsModule } from "./modules/integrations/integrations.module";
import { LeadsModule } from "./modules/leads/leads.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { ProjectsModule } from "./modules/projects/projects.module";
import { TasksModule } from "./modules/tasks/tasks.module";

@Module({
  imports: [
    DatabaseModule,
    IntegrationsModule,
    LeadsModule,
    ConsultationsModule,
    AnalyticsModule,
    ProjectsModule,
    TasksModule,
    DashboardModule,
    NotificationsModule,
  ],
})
export class AppModule {}

