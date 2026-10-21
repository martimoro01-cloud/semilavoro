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
          created_at: string
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
          tipologia_contratto: string
          tipo_opportunita: "operatore" | "volontario"
          stato_pubblicazione: "attivo" | "sospeso" | "archiviato"
        }
        Insert: {
          area: string
          created_at?: string
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
          tipologia_contratto?: string
          tipo_opportunita?: "operatore" | "volontario"
          stato_pubblicazione?: "attivo" | "sospeso" | "archiviato"
        }
        Update: {
          area?: string
          created_at?: string
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
          tipologia_contratto?: string
          tipo_opportunita?: "operatore" | "volontario"
          stato_pubblicazione?: "attivo" | "sospeso" | "archiviato"
        }
        Relationships: []
      }
      bandi: {
        Row: {
          id: string
          titolo: string
          ente: string
          tipo: "concorso" | "avviso" | "bando_enti"
          regione: string
          professione: string
          descrizione: string
          scadenza: string
          url_ufficiale: string
          fonte: "manuale" | "automatica"
          identificativo_fonte: string | null
          verificato: boolean
          pubblicato: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          titolo: string
          ente: string
          tipo: "concorso" | "avviso" | "bando_enti"
          regione?: string
          professione?: string
          descrizione?: string
          scadenza: string
          url_ufficiale: string
          fonte?: "manuale" | "automatica"
          identificativo_fonte?: string | null
          verificato?: boolean
          pubblicato?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titolo?: string
          ente?: string
          tipo?: "concorso" | "avviso" | "bando_enti"
          regione?: string
          professione?: string
          descrizione?: string
          scadenza?: string
          url_ufficiale?: string
          fonte?: "manuale" | "automatica"
          identificativo_fonte?: string | null
          verificato?: boolean
          pubblicato?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      bandi_amministratori: {
        Row: { user_id: string }
        Insert: { user_id: string }
        Update: { user_id?: string }
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
      messaggi_candidatura: {
        Row: { id: string; candidatura_id: string; mittente_id: string; testo: string; created_at: string }
        Insert: { id?: string; candidatura_id: string; mittente_id: string; testo: string; created_at?: string }
        Update: { id?: string; candidatura_id?: string; mittente_id?: string; testo?: string; created_at?: string }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          nome: string
          foto_path: string | null
        }
        Insert: {
          created_at?: string
          id: string
          nome?: string
          foto_path?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          foto_path?: string | null
        }
        Relationships: []
      }
      recensioni: {
        Row: {
          id: string
          autore_id: string
          nome: string
          ruolo: "educatore" | "servizio"
          testo: string
          valutazione: number
          approvata: boolean
          created_at: string
        }
        Insert: {
          id?: string
          autore_id: string
          nome: string
          ruolo: "educatore" | "servizio"
          testo: string
          valutazione: number
          approvata?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          autore_id?: string
          nome?: string
          ruolo?: "educatore" | "servizio"
          testo?: string
          valutazione?: number
          approvata?: boolean
          created_at?: string
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
      puo_messaggiare_candidatura: { Args: { p_candidatura_id: string }; Returns: boolean }
      is_bandi_admin: { Args: Record<PropertyKey, never>; Returns: boolean }
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
