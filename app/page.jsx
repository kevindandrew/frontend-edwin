import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Sistema Admin</h1>
          <p className="text-muted-foreground">Gestiona tu negocio de forma profesional</p>
        </div>
        
        <Link href="/login" className="block">
          <Button className="w-full mb-3">Ingresar al Sistema</Button>
        </Link>
        
        <Link href="/admin" className="block">
          <Button variant="outline" className="w-full">Ir al Dashboard</Button>
        </Link>
      </Card>
    </main>
  )
}
