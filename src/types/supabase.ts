export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Dance = Database["public"]["Tables"]["dances"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];

export interface Database {
   public: {
      Tables: {
         dances: {
            Row: {
               anyonecanview: boolean;
               created_at: string;
               dancers: Json;
               formation_groups: Json;
               formations: Json;
               id: number;
               isInTrash: boolean;
               items: Json[];
               last_edited: string | null;
               name: string;
               organization_id: string | null;
               project_id: string | null;
               props: Json[] | null;
               settings: Json;
               sharesettings: Json;
               soundCloudId: string | null;
               user: string;
            };
            Insert: {
               anyonecanview?: boolean;
               created_at?: string;
               dancers?: Json;
               formation_groups?: Json;
               formations?: Json;
               id?: number;
               isInTrash?: boolean;
               items?: Json[];
               last_edited?: string | null;
               name?: string;
               organization_id?: string | null;
               project_id?: string | null;
               props?: Json[] | null;
               settings?: Json;
               sharesettings?: Json;
               soundCloudId?: string | null;
               user: string;
            };
            Update: {
               anyonecanview?: boolean;
               created_at?: string;
               dancers?: Json;
               formation_groups?: Json;
               formations?: Json;
               id?: number;
               isInTrash?: boolean;
               items?: Json[];
               last_edited?: string | null;
               name?: string;
               organization_id?: string | null;
               project_id?: string | null;
               props?: Json[] | null;
               settings?: Json;
               sharesettings?: Json;
               soundCloudId?: string | null;
               user?: string;
            };
            Relationships: [
               {
                  foreignKeyName: "dances_organization_id_fkey";
                  columns: ["organization_id"];
                  referencedRelation: "organizations";
                  referencedColumns: ["id"];
               },
               {
                  foreignKeyName: "dances_project_id_fkey";
                  columns: ["project_id"];
                  referencedRelation: "projects";
                  referencedColumns: ["id"];
               },
               {
                  foreignKeyName: "dances_user_fkey";
                  columns: ["user"];
                  referencedRelation: "users";
                  referencedColumns: ["id"];
               },
               {
                  foreignKeyName: "dances_user_fkey";
                  columns: ["user"];
                  referencedRelation: "users";
                  referencedColumns: ["id"];
               }
            ];
         };
         deltas: {
            Row: {
               danceid: number | null;
               delta: Json;
               id: string;
               timestamp: string;
               userid: string | null;
            };
            Insert: {
               danceid?: number | null;
               delta: Json;
               id?: string;
               timestamp: string;
               userid?: string | null;
            };
            Update: {
               danceid?: number | null;
               delta?: Json;
               id?: string;
               timestamp?: string;
               userid?: string | null;
            };
            Relationships: [
               {
                  foreignKeyName: "deltas_danceid_fkey";
                  columns: ["danceid"];
                  referencedRelation: "dances";
                  referencedColumns: ["id"];
               },
               {
                  foreignKeyName: "deltas_userid_fkey";
                  columns: ["userid"];
                  referencedRelation: "users";
                  referencedColumns: ["id"];
               },
               {
                  foreignKeyName: "deltas_userid_fkey";
                  columns: ["userid"];
                  referencedRelation: "users";
                  referencedColumns: ["id"];
               }
            ];
         };
         organization_roles: {
            Row: {
               created_at: string | null;
               email: string;
               is_pending: boolean | null;
               organization_id: string;
               role: string | null;
               role_id: string;
               user_id: string | null;
            };
            Insert: {
               created_at?: string | null;
               email: string;
               is_pending?: boolean | null;
               organization_id: string;
               role?: string | null;
               role_id?: string;
               user_id?: string | null;
            };
            Update: {
               created_at?: string | null;
               email?: string;
               is_pending?: boolean | null;
               organization_id?: string;
               role?: string | null;
               role_id?: string;
               user_id?: string | null;
            };
            Relationships: [
               {
                  foreignKeyName: "organization_roles_organization_id_fkey";
                  columns: ["organization_id"];
                  referencedRelation: "organizations";
                  referencedColumns: ["id"];
               }
            ];
         };
         organizations: {
            Row: {
               created_at: string | null;
               id: string;
               name: string | null;
            };
            Insert: {
               created_at?: string | null;
               id?: string;
               name?: string | null;
            };
            Update: {
               created_at?: string | null;
               id?: string;
               name?: string | null;
            };
            Relationships: [];
         };
         permissions: {
            Row: {
               created_at: string | null;
               email: string;
               id: number;
               performance_id: number;
               role: string;
            };
            Insert: {
               created_at?: string | null;
               email: string;
               id?: number;
               performance_id: number;
               role?: string;
            };
            Update: {
               created_at?: string | null;
               email?: string;
               id?: number;
               performance_id?: number;
               role?: string;
            };
            Relationships: [
               {
                  foreignKeyName: "permissions_performance_id_fkey";
                  columns: ["performance_id"];
                  referencedRelation: "dances";
                  referencedColumns: ["id"];
               }
            ];
         };
         projects: {
            Row: {
               created_at: string | null;
               id: string;
               name: string;
               parent_id: string;
            };
            Insert: {
               created_at?: string | null;
               id?: string;
               name?: string;
               parent_id: string;
            };
            Update: {
               created_at?: string | null;
               id?: string;
               name?: string;
               parent_id?: string;
            };
            Relationships: [];
         };
         rosters: {
            Row: {
               created_at: string | null;
               id: number;
               name: string;
               roster: Json[];
               user_id: string;
            };
            Insert: {
               created_at?: string | null;
               id?: number;
               name?: string;
               roster?: Json[];
               user_id: string;
            };
            Update: {
               created_at?: string | null;
               id?: number;
               name?: string;
               roster?: Json[];
               user_id?: string;
            };
            Relationships: [
               {
                  foreignKeyName: "rosters_user_id_fkey";
                  columns: ["user_id"];
                  referencedRelation: "users";
                  referencedColumns: ["id"];
               },
               {
                  foreignKeyName: "rosters_user_id_fkey";
                  columns: ["user_id"];
                  referencedRelation: "users";
                  referencedColumns: ["id"];
               }
            ];
         };
         user_data: {
            Row: {
               created_at: string | null;
               id: number;
               name: string | null;
               response_data: Json | null;
               user_id: string | null;
            };
            Insert: {
               created_at?: string | null;
               id?: number;
               name?: string | null;
               response_data?: Json | null;
               user_id?: string | null;
            };
            Update: {
               created_at?: string | null;
               id?: number;
               name?: string | null;
               response_data?: Json | null;
               user_id?: string | null;
            };
            Relationships: [
               {
                  foreignKeyName: "user_data_user_id_fkey";
                  columns: ["user_id"];
                  referencedRelation: "users";
                  referencedColumns: ["id"];
               },
               {
                  foreignKeyName: "user_data_user_id_fkey";
                  columns: ["user_id"];
                  referencedRelation: "users";
                  referencedColumns: ["id"];
               }
            ];
         };
      };
      Views: {
         users: {
            Row: {
               aud: string | null;
               banned_until: string | null;
               confirmation_sent_at: string | null;
               confirmation_token: string | null;
               confirmed_at: string | null;
               created_at: string | null;
               email: string | null;
               email_change: string | null;
               email_change_confirm_status: number | null;
               email_change_sent_at: string | null;
               email_change_token_current: string | null;
               email_change_token_new: string | null;
               email_confirmed_at: string | null;
               encrypted_password: string | null;
               id: string | null;
               instance_id: string | null;
               invited_at: string | null;
               is_super_admin: boolean | null;
               last_sign_in_at: string | null;
               phone: string | null;
               phone_change: string | null;
               phone_change_sent_at: string | null;
               phone_change_token: string | null;
               phone_confirmed_at: string | null;
               raw_app_meta_data: Json | null;
               raw_user_meta_data: Json | null;
               reauthentication_sent_at: string | null;
               reauthentication_token: string | null;
               recovery_sent_at: string | null;
               recovery_token: string | null;
               role: string | null;
               updated_at: string | null;
            };
            Insert: {
               aud?: string | null;
               banned_until?: string | null;
               confirmation_sent_at?: string | null;
               confirmation_token?: string | null;
               confirmed_at?: string | null;
               created_at?: string | null;
               email?: string | null;
               email_change?: string | null;
               email_change_confirm_status?: number | null;
               email_change_sent_at?: string | null;
               email_change_token_current?: string | null;
               email_change_token_new?: string | null;
               email_confirmed_at?: string | null;
               encrypted_password?: string | null;
               id?: string | null;
               instance_id?: string | null;
               invited_at?: string | null;
               is_super_admin?: boolean | null;
               last_sign_in_at?: string | null;
               phone?: string | null;
               phone_change?: string | null;
               phone_change_sent_at?: string | null;
               phone_change_token?: string | null;
               phone_confirmed_at?: string | null;
               raw_app_meta_data?: Json | null;
               raw_user_meta_data?: Json | null;
               reauthentication_sent_at?: string | null;
               reauthentication_token?: string | null;
               recovery_sent_at?: string | null;
               recovery_token?: string | null;
               role?: string | null;
               updated_at?: string | null;
            };
            Update: {
               aud?: string | null;
               banned_until?: string | null;
               confirmation_sent_at?: string | null;
               confirmation_token?: string | null;
               confirmed_at?: string | null;
               created_at?: string | null;
               email?: string | null;
               email_change?: string | null;
               email_change_confirm_status?: number | null;
               email_change_sent_at?: string | null;
               email_change_token_current?: string | null;
               email_change_token_new?: string | null;
               email_confirmed_at?: string | null;
               encrypted_password?: string | null;
               id?: string | null;
               instance_id?: string | null;
               invited_at?: string | null;
               is_super_admin?: boolean | null;
               last_sign_in_at?: string | null;
               phone?: string | null;
               phone_change?: string | null;
               phone_change_sent_at?: string | null;
               phone_change_token?: string | null;
               phone_confirmed_at?: string | null;
               raw_app_meta_data?: Json | null;
               raw_user_meta_data?: Json | null;
               reauthentication_sent_at?: string | null;
               reauthentication_token?: string | null;
               recovery_sent_at?: string | null;
               recovery_token?: string | null;
               role?: string | null;
               updated_at?: string | null;
            };
            Relationships: [];
         };
      };
      Functions: {
         all_organization_performances: {
            Args: {
               idd: string;
            };
            Returns: Record<string, unknown>[];
         };
         apply_json_patch_operations: {
            Args: {
               operations: Json[];
               dance_id: number;
            };
            Returns: undefined;
         };
         get_all_users_organizations: {
            Args: {
               p_email: string;
            };
            Returns: {
               organization_id: string;
               organization_created_at: string;
               organization_name: string;
               role_email: string;
               role_created_at: string;
               role_organization_id: string;
               role_name: string;
               role_is_pending: boolean;
               owner_user_id: string;
            }[];
         };
         get_dances_by_organization_ids: {
            Args: {
               p_organization_ids: string[];
            };
            Returns: {
               id: number;
               created_at: string;
               user: string;
               dancers: Json;
               soundcloudid: string;
               formations: Json;
               name: string;
               last_edited: string;
               anyonecanview: boolean;
               sharesettings: Json;
               settings: Json;
               isintrash: boolean;
               formation_groups: Json[];
               organization_id: string;
            }[];
         };
         get_dances_by_user: {
            Args: {
               input_uuid: string;
            };
            Returns: {
               anyonecanview: boolean;
               created_at: string;
               dancers: Json;
               formation_groups: Json;
               formations: Json;
               id: number;
               isInTrash: boolean;
               items: Json[];
               last_edited: string | null;
               name: string;
               organization_id: string | null;
               project_id: string | null;
               props: Json[] | null;
               settings: Json;
               sharesettings: Json;
               soundCloudId: string | null;
               user: string;
            }[];
         };
         get_dances_by_user_fix: {
            Args: {
               input_uuid: string;
            };
            Returns: {
               id: number;
               name: string;
               created_at: string;
               user: string;
               dancers: Json;
               soundcloudid: string;
               first_formation: Json;
            }[];
         };
         get_dances_by_user_fix_two: {
            Args: {
               input_uuid: string;
            };
            Returns: {
               id: number;
               name: string;
               created_at: string;
               user: string;
               dancers: Json;
               soundcloudid: string;
               first_formation: Json;
               formation_groups: Json;
            }[];
         };
         get_shared_dances_with_first_formation: {
            Args: {
               email: string;
            };
            Returns: {
               anyonecanview: boolean;
               created_at: string;
               dancers: Json;
               formation_groups: Json;
               formations: Json;
               id: number;
               isInTrash: boolean;
               items: Json[];
               last_edited: string | null;
               name: string;
               organization_id: string | null;
               project_id: string | null;
               props: Json[] | null;
               settings: Json;
               sharesettings: Json;
               soundCloudId: string | null;
               user: string;
            }[];
         };
         get_user_organizations: {
            Args: {
               p_email: string;
            };
            Returns: {
               organization_id: string;
               organization_name: string;
               user_role: string;
               other_users: Json;
               dances: Json[];
            }[];
         };
         get_user_organizations_and_dances: {
            Args: {
               p_email: string;
            };
            Returns: {
               organization_id: string;
               organization_name: string;
               user_role: string;
               users_and_roles: Json;
               dance_id: number;
               dance_created_at: string;
               dance_user: string;
               dancers: Json;
               soundcloudid: string;
               first_formation: Json;
               dance_name: string;
               last_edited: string;
               anyonecanview: boolean;
               sharesettings: Json;
               settings: Json;
               isintrash: boolean;
               formation_groups: Json[];
            }[];
         };
         get_users_by_organization_ids: {
            Args: {
               p_organization_ids: string[];
            };
            Returns: {
               email: string;
               created_at: string;
               organization_id: string;
               role: string;
               is_pending: boolean;
            }[];
         };
         shared_with_me: {
            Args: {
               email: string;
            };
            Returns: Record<string, unknown>[];
         };
         shared_with_me_cleaner: {
            Args: {
               email: string;
            };
            Returns: Record<string, unknown>[];
         };
         unique_dancers: {
            Args: {
               p_user_id: string;
            };
            Returns: {
               dancer_name: string;
            }[];
         };
      };
      Enums: {
         [_ in never]: never;
      };
      CompositeTypes: {
         [_ in never]: never;
      };
   };
}
