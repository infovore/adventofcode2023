defmodule DayFiveTwo do
  def main do
    [filepath | _rest ] = System.argv()

    filestring = File.read!(filepath)

    [seedsString|mapsString] = filestring |> String.split("\n\n") |> Enum.map(&String.trim/1)
    seedMatches = Regex.scan(~r/\d+\s\d+/, seedsString)
    seedRangesAsStrings = Enum.map(seedMatches, fn e -> Enum.at(e,0) |> String.split(" ") end)
    seedRanges = Enum.map(seedRangesAsStrings, fn [a,b] -> [String.to_integer(a), String.to_integer(b)] end)
                  |> Enum.sort(fn [_,a],[_,b] -> a < b end)
    [_x|s] = seedsString |> String.split(": ") |> Enum.map(&String.trim/1)
    # seeds = s |> Enum.at(0) |> String.split(" ") |> Enum.map(&String.to_integer/1)

    maps = mapsString |> Enum.map(fn frag ->
      [_title | map] = frag |> String.split("\n") |> Enum.map(&String.trim/1)
      map |> Enum.map( fn s ->
        s |> String.split(" ") |> Enum.map(&String.to_integer/1)
      end)
    end)

    # pt1:
    # results = seeds |> Enum.map(fn seed ->
      # reducingRemap(seed,maps)
    # end)

    #pt2:
    results = Enum.flat_map(seedRanges, fn [start,len] ->
      IO.puts("start: #{start}, len: #{len}")
      Enum.map(start..(start+len), fn i ->
        reducingRemap(i,maps)
      end)
    end)


    # IO.inspect(results, charlists: :as_lists)
    IO.puts(Enum.min(results))


  end

  def remap(n, map) do
    mappings = map |> Enum.map(fn [dest,source,len] ->
      if (n >= source) && (n <= source + len) do
        dest + (n - source)
      end
    end) |> Enum.filter(&(&1 != nil))

    if Enum.count(mappings) > 0 do
      Enum.at(mappings,0)
    else
      n
    end
  end

  def reducingRemap(n,maps) do
    Enum.reduce(maps, n, fn map, acc ->
      remap(acc, map)
    end)
  end

end

DayFiveTwo.main()
