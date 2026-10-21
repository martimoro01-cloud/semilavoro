export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      annunci: {
        Row: {
          area: string
          contratto_al: string | null
          contratto_dal: string | null
          created_at: string
          durata_contratto: string | null
          email: string
          guadagno_max: number
          guadagno_min: number
          id: string
          impegno: string
          in_primo_piano: boolean
          informazioni: string
          mansione: string
          note_retribuzione: string
          owner_id: string | null
          provincia: string
          regione: string
          servizio: string
          stato_pubblicazione: string
          tipo_opportunita: string | null
          tipologia_contratto: string | null
        }
        Insert: {
          area: string
          contratto_al?: string | null
          contratto_dal?: string | null
          created_at?: string
          durata_contratto?: string | null
          email: string
          guadagno_max: number
          guadagno_min: number
          id?: string
          impegno: string
          in_primo_piano?: boolean
          informazioni: string
          mansione: string
          note_retribuzione: string
          owner_id?: string | null
          provincia: string
          regione: string
          servizio: string
          stato_pubblicazione?: string
          tipo_opportunita?: string | null
          tipologia_contratto?: string | null
        }
        Update: {
          area?: string
          contratto_al?: string | null
          contratto_dal?: string | null
          created_at?: string
          durata_contratto?: string | null
          email?: string
          guadagno_max?: number
          guadagno_min?: number
          id?: string
          impegno?: string
          in_primo_piano?: boolean
          informazioni?: string
          mansione?: string
          note_retribuzione?: string
          owner_id?: string | null
          provincia?: string
          regione?: string
          servizio?: string
          stato_pubblicazione?: string
          tipo_opportunita?: string | null
          tipologia_contratto?: string | null
        }
        Relationships: []
      }
      candidature: {
        Row: {
          annuncio_id: string
          candidato_id: string
          cellulare: string
          colloquio_at: string | null
          colloquio_luogo: string | null
          created_at: string
          cv_path: string
          email: string
          id: string
          lettera: string
          nome: string
          risposta: string | null
          stato: Database["public"]["Enums"]["stato_candidatura"]
        }
        Insert: {
          annuncio_id: string
          candidato_id: string
          cellulare: string
          colloquio_at?: string | null
          colloquio_luogo?: string | null
          created_at?: string
          cv_path: string
          email: string
          id?: string
          lettera: string
          nome?: string
          risposta?: string | null
          stato?: Database["public"]["Enums"]["stato_candidatura"]
        }
        Update: {
          annuncio_id?: string
          candidato_id?: string
          cellulare?: string
          colloquio_at?: string | null
          colloquio_luogo?: string | null
          created_at?: string
          cv_path?: string
          email?: string
          id?: string
          lettera?: string
          nome?: string
          risposta?: string | null
          stato?: Database["public"]["Enums"]["stato_candidatura"]
        }
        Relationships: [
          {
            foreignKeyName: "candidature_annuncio_id_fkey"
            columns: ["annuncio_id"]
            isOneToOne: false
            referencedRelation: "annunci"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          citta: string | null
          created_at: string
          cv_path: string | null
          descrizione: string | null
          esperienza: string | null
          id: string
          nome: string
          qualifica: string | null
          sito_web: string | null
          telefono: string | null
        }
        Insert: {
          citta?: string | null
          created_at?: string
          cv_path?: string | null
          descrizione?: string | null
          esperienza?: string | null
          id: string
          nome?: string
          qualifica?: string | null
          sito_web?: string | null
          telefono?: string | null
        }
        Update: {
          citta?: string | null
          created_at?: string
          cv_path?: string | null
          descrizione?: string | null
          esperienza?: string | null
          id?: string
          nome?: string
          qualifica?: string | null
          sito_web?: string | null
          telefono?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      annuncio_aperto: { Args: { _annuncio_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      owns_annuncio: { Args: { _annuncio_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "educatore" | "servizio"
      stato_candidatura: "in_attesa" | "accettata" | "rifiutata" | "colloquio"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["educatore", "servizio"],
      stato_candidatura: ["in_attesa", "accettata", "rifiutata", "colloquio"],
    },
  },
} as const
