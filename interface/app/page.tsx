"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCallback, useState } from "react";

const formSchema = z.object({
  platform: z.string().nullish(),
  gamemode: z.string().nullish(),
  mapname: z.string().nullish(),
  roundnumber: z.string().nullish(),
  endroundreason: z.string().nullish(),
  roundduration: z.string().nullish(),
  clearencelevel: z.string().nullish(),
  skillrank: z.string().nullish(),
  role: z.string().nullish(),
  haswon: z.string().nullish(),
  operator: z.string().nullish(),
  nbkills: z.string().nullish(),
  isdead: z.string().nullish(),
});

export default function Component() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: null,
      gamemode: null,
      mapname: null,
      roundnumber: null,
      endroundreason: null,
      roundduration: null,
      clearencelevel: null,
      skillrank: null,
      role: null,
      haswon: null,
      operator: null,
      nbkills: null,
      isdead: null,
    },
  });

  console.log(form.getValues());

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);
    try {
      console.log(values);
      const response = await fetch("http://localhost:3001/match/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform: values.platform,
          gamemode: values.gamemode,
          mapname: values.mapname,
          roundnumber: values.roundnumber ? Number(values.roundnumber) : null,
          endroundreason: values.endroundreason,
          roundduration: values.roundduration
            ? Number(values.roundduration)
            : null,
          clearencelevel: values.clearencelevel
            ? Number(values.clearencelevel)
            : null,
          skillrank: values.skillrank,
          role: values.role,
          haswon: values.haswon ? Number(values.haswon) : null,
          operator: values.operator,
          nbkills: values.nbkills ? Number(values.nbkills) : null,
          isdead: values.isdead ? Number(values.isdead) : null,
        }),
      }).then((res) => res.json());
      setData(response);
      console.log(response);
    } catch (err) {
      setIsError(true);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro ao se coumincar com a base de dados.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const resetSearch = () => setData([]);

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-950">
      <div className="mx-auto w-full space-y-6">
        {!isLoading && data[0] ? (
          <div className="grid gap-8 md:gap-12">
            <div className="absolute top-5 right-6">
              <Button onClick={() => resetSearch()}>
                <p>Voltar</p>
              </Button>
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Comparação de similaridade
              </h2>
              {isError ? (
                <p className="text-gray-500 dark:text-gray-400">{error}</p>
              ) : null}
            </div>
            <div className="border rounded-lg overflow-hidden">
              <Table className="bg-white">
                <TableHeader>
                  <TableRow>
                    <TableHead>Plataforma</TableHead>
                    <TableHead>Modo de jogo</TableHead>
                    <TableHead>Mapa</TableHead>
                    <TableHead>Round</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Tempo</TableHead>
                    <TableHead>Ranque</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Ganhou</TableHead>
                    <TableHead>Operador</TableHead>
                    <TableHead>Eliminações</TableHead>
                    <TableHead>Morreu</TableHead>
                    <TableHead>Similaridade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map(({ partida, similaridade }: any) => (
                    <TableRow key={partida._id}>
                      <TableCell className="font-medium">
                        {partida.platform}
                      </TableCell>
                      <TableCell className="font-medium">
                        {partida.gamemode}
                      </TableCell>
                      <TableCell className="font-medium">
                        {partida.mapname}
                      </TableCell>
                      <TableCell className="font-medium">
                        {partida.roundnumber}
                      </TableCell>
                      <TableCell className="font-medium">
                        {partida.endroundreason}
                      </TableCell>
                      <TableCell className="font-medium">
                        {partida.roundduration}s
                      </TableCell>
                      <TableCell className="font-medium">
                        {partida.skillrank}
                      </TableCell>
                      <TableCell className="font-medium">
                        {partida.role}
                      </TableCell>
                      <TableCell className="font-medium">
                        {partida.haswon ? "Sim" : "Não"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {partida.operator}
                      </TableCell>
                      <TableCell className="font-medium">
                        {String(partida.nbkills)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {partida.isdead ? "Sim" : "Não"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={similaridade * 100} />
                          <span className="font-medium">
                            {(similaridade * 100).toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Avaliar partida</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Preencha o formulário com os dados da partida a ser avaliada.
              </p>
            </div>
            {isError ? (
              <p className="text-gray-500 dark:text-gray-400">{error}</p>
            ) : null}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="platform"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Plataforma</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma plataforma" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PS4">Playstation</SelectItem>
                            <SelectItem value="XONE">Xbox</SelectItem>
                            <SelectItem value="PC">PC</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="gamemode"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="gamemode">Modo de jogo</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um modo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BOMB">Bomba</SelectItem>
                            <SelectItem value="SECURE_AREA">
                              Segurar Area
                            </SelectItem>
                            <SelectItem value="HOSTAGE">Refém</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="mapname"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="mapname">Mapa</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um mapa" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BANK">Banco</SelectItem>
                            <SelectItem value="CHALET">Chalé</SelectItem>
                            <SelectItem value="CLUB_HOUSE">
                              Casa de Campo
                            </SelectItem>
                            <SelectItem value="CONSULATE">Consulado</SelectItem>
                            <SelectItem value="HEREFORD_BASE">
                              Base Hereford
                            </SelectItem>
                            <SelectItem value="HOUSE">Casa</SelectItem>
                            <SelectItem value="KAFE_TOSTOYESVSKY">
                              Café Dostoyevsky
                            </SelectItem>
                            <SelectItem value="PLANE">Avião</SelectItem>
                            <SelectItem value="KANAL">Canal</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="roundnumber"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="roundnumber">
                          Número do round
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            pattern="[0-9]"
                            placeholder={"1"}
                            min={1}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4">
                  <FormField
                    name="endroundreason"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="endroundreason">
                          Motivo de final de round
                        </FormLabel>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um motivo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TimeExpired">
                              Tempo expirado
                            </SelectItem>
                            <SelectItem value="AttackersEliminated">
                              Atacantes eliminados
                            </SelectItem>
                            <SelectItem value="DefendersEliminated">
                              Defensores eliminados
                            </SelectItem>
                            <SelectItem value="AttackersKilledHostage">
                              Atacantes eliminaram o refém
                            </SelectItem>
                            <SelectItem value="DefendersKilledHostage">
                              Defensores eliminaram o refém
                            </SelectItem>
                            <SelectItem value="ObjectiveCaptured">
                              Objetivo capturado
                            </SelectItem>
                            <SelectItem value="ObjectiveProtected">
                              Objetivo protegido
                            </SelectItem>
                            <SelectItem value="BombExploded">
                              Bomba explodiu
                            </SelectItem>
                            <SelectItem value="BombDeactivated_OneBomb">
                              Bomba desativada
                            </SelectItem>
                            <SelectItem value="AttackersSurrendered">
                              Atacantes desistiram
                            </SelectItem>
                            <SelectItem value="DefendersSurrendered">
                              Defensores desistiram
                            </SelectItem>
                            <SelectItem value="HostageExtracted">
                              Refém extraido
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="roundduration"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="roundduration">
                          Duração de round em segundos
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            pattern="[0-9]"
                            placeholder={"240"}
                            min={240}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="clearencelevel"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="clearencelevel">
                          Level do jogador
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            pattern="[0-9]"
                            placeholder={"1"}
                            min={1}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="skillrank"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="skillrank">
                          Rank do jogador
                        </FormLabel>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um ranque" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Unkranked">
                              Sem ranque
                            </SelectItem>
                            <SelectItem value="Copper">Cobre</SelectItem>
                            <SelectItem value="Bronze">Bronze</SelectItem>
                            <SelectItem value="Silver">Prata</SelectItem>
                            <SelectItem value="Gold">Ouro</SelectItem>
                            <SelectItem value="Platinum">Platina</SelectItem>
                            <SelectItem value="Diamond">Diamante</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="role"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="role">Time</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Defender">Defensor</SelectItem>
                            <SelectItem value="Attacker">Atacante</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="haswon"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="haswon">Ganhou</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma opção" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Sim</SelectItem>
                            <SelectItem value="0">Não</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="operator"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="operator">Operador</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um operador" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="JTF2-FROST">Frost</SelectItem>
                            <SelectItem value="JTF2-BUCK">Buck</SelectItem>
                            <SelectItem value="G.E.O.-JACKAL">
                              Jackal
                            </SelectItem>
                            <SelectItem value="G.E.O.-MIRA">Mira</SelectItem>
                            <SelectItem value="GIGN-ROOK">Rook</SelectItem>
                            <SelectItem value="GIGN-MONTANHA">
                              Montanha
                            </SelectItem>
                            <SelectItem value="GIGN-DOC">Doc</SelectItem>
                            <SelectItem value="GIGN-TWITCH">Twitch</SelectItem>
                            <SelectItem value="SWAT-CASTLE">Castle</SelectItem>
                            <SelectItem value="SWAT-PULSE">Pulse</SelectItem>
                            <SelectItem value="SWAT-ASH">Ash</SelectItem>
                            <SelectItem value="SWAT-THERMITE">
                              Thermite
                            </SelectItem>
                            <SelectItem value="SAS-SMOKE">Smoke</SelectItem>
                            <SelectItem value="SAS-SLEDGE">Sledge</SelectItem>
                            <SelectItem value="SAS-THATCHER">
                              Thatcher
                            </SelectItem>
                            <SelectItem value="SAS-MUTE">Mute</SelectItem>
                            <SelectItem value="BOPE-CAVEIRA">
                              Caveira
                            </SelectItem>
                            <SelectItem value="BOPE-CAPITÃO">
                              Capitão
                            </SelectItem>
                            <SelectItem value="SPETSNAZ-FUZE">Fuze</SelectItem>
                            <SelectItem value="SPETSNAZ-GLAZ">Glaz</SelectItem>
                            <SelectItem value="SPETSNAZ-TACHANKA">
                              Tachanka
                            </SelectItem>
                            <SelectItem value="SPETSNAZ-KAPKAN">
                              Kapkan
                            </SelectItem>
                            <SelectItem value="GSG9-IQ">IQ</SelectItem>
                            <SelectItem value="GSG9-BLITZ">Blitz</SelectItem>
                            <SelectItem value="GSG9-BANDIT">Bandit</SelectItem>
                            <SelectItem value="GSG9-JAGER">Jager</SelectItem>
                            <SelectItem value="SAT-ECHO">Echo</SelectItem>
                            <SelectItem value="SAT-HIBANA">Hibana</SelectItem>
                            <SelectItem value="NAVYSEAL-VALKRYE">
                              Valkrye
                            </SelectItem>
                            <SelectItem value="NAVYSEAL-BLACKBEARD">
                              Blackbeard
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="nbkills"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="nbkills">Número de kills</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            pattern="[0-9]"
                            placeholder={"0"}
                            max="8"
                            step="1"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="isdead"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel htmlFor="isdead">Morreu</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma opção" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Sim</SelectItem>
                            <SelectItem value="0">Não</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {!isLoading ? `Verificar assimilaridade` : `Carregando...`}
                </Button>
              </form>
            </Form>
          </>
        )}
      </div>
    </main>
  );
}
